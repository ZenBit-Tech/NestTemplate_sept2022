up:
	docker-compose -f devops/docker-compose.local.yml --project-name projectname up --build -d
down:
	docker-compose -f devops/docker-compose.local.yml --project-name projectname down