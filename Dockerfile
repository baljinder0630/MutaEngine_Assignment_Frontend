# Use Node.js as the base image
FROM node:18
# Create app directory
WORKDIR /medlr/frontend
# Install app dependencies
COPY package*.json ./
RUN npm ci
# Bundle app source
COPY . .
# Expose the port the app runs on (default for Vite is 5173)
EXPOSE 5000
# Start the app in development mode
CMD ["npm", "run", "dev"]
