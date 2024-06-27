# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install NestJS dependencies
RUN npm install --legacy-peer-deps


# Copy the rest of the application code
COPY . .

# # Build the NestJS application (optional step depending on your project setup)
RUN npm run build

# Expose the port on which the NestJS app runs
EXPOSE 3000

# Command to run the NestJS application
CMD ["npm", "run", "start:prod"]
