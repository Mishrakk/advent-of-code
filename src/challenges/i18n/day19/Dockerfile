FROM node:20

# Install zic (from tzdata package)
RUN apt-get update && apt-get install -y tzdata && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Clone moment-timezone repository
RUN apt-get update && apt-get install -y git && \
    git clone --depth 1 https://github.com/moment/moment-timezone.git -b develop . && \
    rm -rf .git

# Install dependencies
RUN npm install

# Run grunt task to build data for versions
RUN npx grunt data:2018c
RUN npx grunt data:2021b

# Show the created data files
CMD ["ls", "-la", "-R", "data"]