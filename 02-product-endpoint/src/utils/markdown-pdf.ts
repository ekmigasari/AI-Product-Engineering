import { createWriteStream } from "node:fs";
import { lexer, type Token, type Tokens } from "marked";
import PDFDocument from "pdfkit";

const PDF_MARGIN = 38;
const BODY_FONT_SIZE = 9.5;
const BODY_COLOR = "#111827";
const MUTED_COLOR = "#6b7280";
const BORDER_COLOR = "#d1d5db";
const LINE_GAP = 1.6;
const PARAGRAPH_GAP = 4;
const SECTION_GAP = 6;
const FOOTER_HEIGHT = 22;

type TextStyle = {
  font: string;
  color: string;
};

export function writeMarkdownPdf(markdown: string, filePath: string) {
  return new Promise<void>((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      bufferPages: true,
      margins: {
        top: PDF_MARGIN,
        right: PDF_MARGIN,
        bottom: PDF_MARGIN,
        left: PDF_MARGIN,
      },
      info: {
        Title: "AI Research Report",
        Creator: "product-endpoint",
      },
    });

    const stream = createWriteStream(filePath);

    stream.on("finish", resolve);
    stream.on("error", reject);
    doc.on("error", reject);

    doc.pipe(stream);
    renderMarkdownTokens(doc, lexer(normalizeMarkdown(markdown)));
    addPageNumbers(doc);
    doc.end();
  });
}

function renderMarkdownTokens(
  doc: PDFKit.PDFDocument,
  tokens: Token[],
  indent = 0,
  style: TextStyle = { font: "Helvetica", color: BODY_COLOR },
) {
  for (const token of tokens) {
    switch (token.type) {
      case "space":
        addGap(doc, 3);
        break;
      case "heading":
        renderHeading(doc, token as Tokens.Heading, indent);
        break;
      case "paragraph":
        renderParagraph(doc, inlineText(token.tokens, token.text), indent, style);
        break;
      case "text":
        renderParagraph(doc, inlineText(token.tokens, token.text), indent, style);
        break;
      case "list":
        renderList(doc, token as Tokens.List, indent, style);
        break;
      case "blockquote":
        renderBlockquote(doc, token as Tokens.Blockquote, indent);
        break;
      case "code":
        renderCodeBlock(doc, token as Tokens.Code, indent);
        break;
      case "hr":
        renderRule(doc, indent);
        break;
      case "table":
        renderTable(doc, token as Tokens.Table, indent);
        break;
      case "html":
        renderParagraph(doc, stripHtml(token.text), indent, style);
        break;
      default:
        if ("tokens" in token && Array.isArray(token.tokens)) {
          renderMarkdownTokens(doc, token.tokens, indent, style);
        }
        break;
    }
  }
}

function renderHeading(
  doc: PDFKit.PDFDocument,
  token: Tokens.Heading,
  indent: number,
) {
  const fontSize = headingFontSize(token.depth);
  const text = inlineText(token.tokens, token.text);
  const height = measureText(doc, text, "Helvetica-Bold", fontSize, indent, 2);
  ensureSpace(doc, height + SECTION_GAP * 2);

  if (!isAtPageTop(doc)) {
    addGap(doc, token.depth === 1 ? 8 : 5);
  }

  doc
    .font("Helvetica-Bold")
    .fontSize(fontSize)
    .fillColor(BODY_COLOR)
    .text(text, textX(doc, indent), doc.y, {
      width: textWidth(doc, indent),
      lineGap: 2,
    });
  addGap(doc, token.depth === 1 ? 5 : 3);
}

function renderParagraph(
  doc: PDFKit.PDFDocument,
  text: string,
  indent: number,
  style: TextStyle,
) {
  const value = text.trim();

  if (!value) {
    return;
  }

  const height = measureText(
    doc,
    value,
    style.font,
    BODY_FONT_SIZE,
    indent,
    LINE_GAP,
  );
  ensureSpace(doc, height + PARAGRAPH_GAP);

  doc
    .font(style.font)
    .fontSize(BODY_FONT_SIZE)
    .fillColor(style.color)
    .text(value, textX(doc, indent), doc.y, {
      width: textWidth(doc, indent),
      lineGap: LINE_GAP,
    });
  addGap(doc, PARAGRAPH_GAP);
}

function renderList(
  doc: PDFKit.PDFDocument,
  token: Tokens.List,
  indent: number,
  style: TextStyle,
) {
  const startNumber = typeof token.start === "number" ? token.start : 1;

  token.items.forEach((item, index) => {
    const firstToken = item.tokens[0];
    const firstLine =
      firstToken?.type === "paragraph" || firstToken?.type === "text"
        ? inlineText(firstToken.tokens, firstToken.text)
        : item.text.split("\n")[0] ?? "";
    const remainingTokens =
      firstToken?.type === "paragraph" || firstToken?.type === "text"
        ? item.tokens.slice(1)
        : item.tokens;
    const label = token.ordered
      ? `${startNumber + index}.`
      : item.task
        ? item.checked
          ? "[x]"
          : "[ ]"
        : "-";
    const labelWidth = token.ordered ? 28 : 18;
    const itemIndent = indent + labelWidth;
    const itemText = firstLine.trim();
    const height = measureText(
      doc,
      itemText,
      style.font,
      BODY_FONT_SIZE,
      itemIndent,
      LINE_GAP,
    );

    ensureSpace(doc, height + 4);
    const y = doc.y;

    doc
      .font(style.font)
      .fontSize(BODY_FONT_SIZE)
      .fillColor(style.color)
      .text(label, textX(doc, indent), y, { width: labelWidth });

    if (itemText) {
      doc
        .font(style.font)
        .fontSize(BODY_FONT_SIZE)
        .fillColor(style.color)
        .text(itemText, textX(doc, itemIndent), y, {
          width: textWidth(doc, itemIndent),
          lineGap: LINE_GAP,
        });
    } else {
      doc.y = y + BODY_FONT_SIZE + LINE_GAP;
    }

    addGap(doc, 2);

    if (remainingTokens.length > 0) {
      renderMarkdownTokens(doc, remainingTokens, itemIndent, style);
    }
  });

  addGap(doc, 2);
}

function renderBlockquote(
  doc: PDFKit.PDFDocument,
  token: Tokens.Blockquote,
  indent: number,
) {
  const quoteIndent = indent + 16;

  ensureSpace(doc, BODY_FONT_SIZE * 2);
  const y = doc.y;
  doc
    .save()
    .strokeColor(BORDER_COLOR)
    .lineWidth(2)
    .moveTo(textX(doc, indent), y)
    .lineTo(textX(doc, indent), y + BODY_FONT_SIZE * 2)
    .stroke()
    .restore();

  renderMarkdownTokens(doc, token.tokens, quoteIndent, {
    font: "Helvetica-Oblique",
    color: MUTED_COLOR,
  });
  doc.fillColor(BODY_COLOR).font("Helvetica");
}

function renderCodeBlock(
  doc: PDFKit.PDFDocument,
  token: Tokens.Code,
  indent: number,
) {
  const width = textWidth(doc, indent);
  const text = token.text.trimEnd() || " ";

  doc.font("Courier").fontSize(9);
  const height = doc.heightOfString(text, { width: width - 16, lineGap: 2 }) + 14;
  ensureSpace(doc, height);

  const x = textX(doc, indent);
  const y = doc.y;

  doc
    .save()
    .roundedRect(x, y, width, height, 4)
    .fillAndStroke("#f3f4f6", "#e5e7eb")
    .restore();
  doc
    .font("Courier")
    .fontSize(9)
    .fillColor(BODY_COLOR)
    .text(text, x + 8, y + 7, { width: width - 16, lineGap: 2 });
  doc.y = y + height + PARAGRAPH_GAP;
}

function renderRule(doc: PDFKit.PDFDocument, indent: number) {
  ensureSpace(doc, 24);
  const x = textX(doc, indent);
  doc
    .save()
    .strokeColor(BORDER_COLOR)
    .lineWidth(1)
    .moveTo(x, doc.y + 8)
    .lineTo(x + textWidth(doc, indent), doc.y + 8)
    .stroke()
    .restore();
  doc.y += 18;
}

function renderTable(
  doc: PDFKit.PDFDocument,
  token: Tokens.Table,
  indent: number,
) {
  const rows = [token.header, ...token.rows].map((row) =>
    row.map((cell) => inlineText(cell.tokens, cell.text).trim()),
  );

  if (rows.length === 0 || rows[0].length === 0) {
    return;
  }

  const x = textX(doc, indent);
  const width = textWidth(doc, indent);
  const columnCount = rows[0].length;
  const columnWidth = width / columnCount;
  const paddingX = 5;
  const paddingY = 4;

  rows.forEach((row, rowIndex) => {
    const isHeader = rowIndex === 0;
    const rowHeight =
      Math.max(
        ...row.map((cell) =>
          measureRawText(
            doc,
            cell || " ",
            isHeader ? "Helvetica-Bold" : "Helvetica",
            8.4,
            columnWidth - paddingX * 2,
            1.2,
          ),
        ),
      ) +
      paddingY * 2;

    ensureSpace(doc, rowHeight);
    const y = doc.y;

    doc
      .save()
      .rect(x, y, width, rowHeight)
      .fill(isHeader ? "#f3f4f6" : "#ffffff")
      .restore();

    row.forEach((cell, cellIndex) => {
      const cellX = x + cellIndex * columnWidth;

      doc
        .save()
        .strokeColor(BORDER_COLOR)
        .lineWidth(0.5)
        .rect(cellX, y, columnWidth, rowHeight)
        .stroke()
        .restore();

      doc
        .font(isHeader ? "Helvetica-Bold" : "Helvetica")
        .fontSize(8.4)
        .fillColor(BODY_COLOR)
        .text(cell || " ", cellX + paddingX, y + paddingY, {
          width: columnWidth - paddingX * 2,
          lineGap: 1.2,
        });
    });

    doc.y = y + rowHeight;
  });

  addGap(doc, PARAGRAPH_GAP + 1);
}

function addPageNumbers(doc: PDFKit.PDFDocument) {
  const pageRange = doc.bufferedPageRange();

  for (
    let pageIndex = pageRange.start;
    pageIndex < pageRange.start + pageRange.count;
    pageIndex += 1
  ) {
    doc.switchToPage(pageIndex);
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(MUTED_COLOR)
      .text(
        `Page ${pageIndex - pageRange.start + 1} of ${pageRange.count}`,
        doc.page.margins.left,
        doc.page.height - 42,
        {
          align: "center",
          width: contentWidth(doc),
        },
      );
  }
}

function inlineText(tokens: Token[] | undefined, fallback: string) {
  if (!tokens || tokens.length === 0) {
    return fallback;
  }

  return tokens.map(inlineTokenText).join("");
}

function inlineTokenText(token: Token): string {
  switch (token.type) {
    case "br":
      return "\n";
    case "codespan":
      return token.text;
    case "em":
    case "strong":
    case "del":
      return inlineText(token.tokens, token.text);
    case "escape":
    case "text":
      return inlineText("tokens" in token ? token.tokens : undefined, token.text);
    case "link": {
      const text = inlineText(token.tokens, token.text);
      return text === token.href ? text : `${text} (${token.href})`;
    }
    case "image":
      return token.text ? `[image: ${token.text}]` : "[image]";
    case "html":
      return stripHtml(token.text);
    default:
      if ("tokens" in token && Array.isArray(token.tokens)) {
        return inlineText(token.tokens, token.raw);
      }

      return "text" in token && typeof token.text === "string"
        ? token.text
        : token.raw;
  }
}

function stripHtml(value: string) {
  return value.replaceAll(/<[^>]*>/g, "").trim();
}

function normalizeMarkdown(markdown: string) {
  return markdown
    .replaceAll(/\r\n?/g, "\n")
    .replaceAll(/[\t ]+\n/g, "\n")
    .replaceAll(/\n{3,}/g, "\n\n")
    .trim();
}

function headingFontSize(depth: number) {
  if (depth === 1) {
    return 22;
  }

  if (depth === 2) {
    return 17;
  }

  if (depth === 3) {
    return 14;
  }

  return 12;
}

function ensureSpace(doc: PDFKit.PDFDocument, height: number) {
  const bottom = usableBottom(doc);

  if (!isAtPageTop(doc) && doc.y + height > bottom) {
    doc.addPage();
  }
}

function addGap(doc: PDFKit.PDFDocument, gap: number) {
  if (doc.y + gap <= usableBottom(doc)) {
    doc.y += gap;
  }
}

function isAtPageTop(doc: PDFKit.PDFDocument) {
  return doc.y <= doc.page.margins.top + 6;
}

function usableBottom(doc: PDFKit.PDFDocument) {
  return doc.page.height - doc.page.margins.bottom - FOOTER_HEIGHT;
}

function measureText(
  doc: PDFKit.PDFDocument,
  text: string,
  font: string,
  size: number,
  indent: number,
  lineGap: number,
) {
  return measureRawText(doc, text, font, size, textWidth(doc, indent), lineGap);
}

function measureRawText(
  doc: PDFKit.PDFDocument,
  text: string,
  font: string,
  size: number,
  width: number,
  lineGap: number,
) {
  doc.font(font).fontSize(size);
  return doc.heightOfString(text || " ", { width, lineGap });
}

function textX(doc: PDFKit.PDFDocument, indent: number) {
  return doc.page.margins.left + indent;
}

function textWidth(doc: PDFKit.PDFDocument, indent: number) {
  return contentWidth(doc) - indent;
}

function contentWidth(doc: PDFKit.PDFDocument) {
  return doc.page.width - doc.page.margins.left - doc.page.margins.right;
}
