 = @{
  Authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWwxYnZ6ZnkwMDAycmF0ZmoxMjNxeng4IiwiY29tcGFueUlkIjoiY21sMWJ2dWQ4MDAwMHJhdGZ5bnEwOWVvbSIsInJvbGUiOiJPV05FUiIsImVtYWlsIjoiYWRtaW5AdGVzdC5jb20iLCJuYW1lIjoiQWRtaW4gVGVzdGUiLCJpYXQiOjE3Njk4MDQ0ODEsImV4cCI6MTc3MDQwOTI4MX0.GhOlDXp0hJvFeiTUXm6A7aNtuWXU2UoJmhyqVZzWHkQ'
  'x-company-id' = 'cml1bvud80000ratfynq09eom'
}
 = @{ nomeCompleto = 'Cliente 1' } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:3000/clients -Method Post -Headers  -Body  -ContentType 'application/json' | ConvertTo-Json
