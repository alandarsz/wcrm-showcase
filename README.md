# Panel CRM Wahana

\*Syarat:

- Ini adalah repo Panel CRM Wahana yang sudah menggunakan docker, syarat menggunakan nodejs minimal versi 20.x

## Petunjuk untuk build docker, running docker dan push to container registry

---

(BUILD FOR PRODUCTION ONLY)

# Build Docker Image with docker-compose

docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Running Docker Container on port 4500

docker run -p 4500:80 -d --name wahana-crm-panel wahana-crm-panel:latest

# Tag Docker image (sekarang wajib di tag sebelum di upload)

docker tag wahana-crm-panel:latest docker-registry.stage.wahana.com/wahana-crm-panel/wahana-crm-panel:latest
 
# Push image to google container registry asia zone

Format: HOST-NAME/PROJECT-ID/REPOSITORY/IMAGE
docker push docker-registry.stage.wahana.com/wahana-crm-panel/wahana-crm-panel:latest
<!-- docker pull docker-registry.stage.wahana.com/wahana-crm-panel/wahana-crm-panel:latest -->

# Jalankan Image

docker run -d --name w-crm_fe_prod -p 4500:80 docker-registry.stage.wahana.com/wahana-crm-panel/wahana-crm-panel

##Catatan lainnya

- Untuk melihat list container yang aktif di localhost gunakan command:
  docker container ls -a
- untuk force delete container yang aktif gunakan command:
  docker rm [CONTAINER_ID] -f
- pakai encodeURI kalau mau simpan xml ke database :https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_encodeuri

---

(BUILD FOR DEVELOPMENT ONLY)

# Build Docker Image with docker-compose

docker compose -f docker-compose.yml -f docker-compose.dev.yml build

# Running Docker Container on port 4500

docker run -p 4500:80 -d --name dev-wahana dev-wahana-crm-panel:latest

# Tag Docker image (sekarang wajib di tag sebelum di upload)

docker tag dev-wahana-crm-panel:latest docker-registry.stage.wahana.com/dev-wahana-crm-panel/dev-wahana-crm-panel:latest

# Push image to google container registry asia zone

Format: HOST-NAME/PROJECT-ID/REPOSITORY/IMAGE
docker push docker-registry.stage.wahana.com/dev-wahana-crm-panel/dev-wahana-crm-panel:latest
