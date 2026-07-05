1. User mengirim input lewat API.
2. Data disimpan ke database menggunakan Prisma.
3. Job diproses oleh worker/queue.
4. AI menjalankan beberapa prompt.
5. Hasilnya disimpan kembali ke database atau dijadikan file.
6. Bisa juga ditambah evaluator untuk mengecek kualitas hasil.

Research about Customers Insights

1. Send request to API from requests.http
2. The router save input the data to database
3. aiResearchQueue process
4. queue trigger the worker
5. worker process the request, create the report pdf, and update the database
