FROM node:alpine

WORKDIR /app

# Copy only package.json and package-lock.json (if you have one)
COPY package.json package-lock.json* ./

# Install dependencies first - this step uses minimal context
RUN npm install --legacy-peer-deps

# Now copy rest of your app files
COPY . .

# Build your app
RUN npm run build

# Start the app
CMD ["npm", "run", "start"]
