# Makefile for local development

# Install dependencies for client and server
install:
	npm install --prefix client
	npm install --prefix server

# Start the app locally (frontend + backend)
start:
	npm start --prefix client &
	npm start --prefix server

# Build the frontend for production
build-client:
	npm run build --prefix client

# Clean build artifacts
clean:
	rm -rf client/build