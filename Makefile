up:
	docker-compose -f devops/docker-compose.local.yml --project-name setspace up --build -d
down:
	docker-compose -f devops/docker-compose.local.yml --project-name setspace down