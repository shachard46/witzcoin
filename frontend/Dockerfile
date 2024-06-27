# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the project dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the React application
RUN npm run build

# Install a lightweight web server (like serve) to serve the build output
RUN npm install -g serve

# Specify the command to run the application
CMD ["serve", "-s", "build"]

# Expose the port the app runs on
EXPOSE 5000
