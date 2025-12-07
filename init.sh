#!/bin/bash

# Fernando Torres Personal Website - Development Environment Setup
# This script initializes the development environment for the personal website project.

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "=============================================="
echo "  Fernando Torres Personal Website"
echo "  Development Environment Setup"
echo "=============================================="
echo -e "${NC}"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print status
print_status() {
    echo -e "${GREEN}[OK]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Check prerequisites
echo -e "\n${BLUE}Checking prerequisites...${NC}\n"

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -ge 18 ]; then
        print_status "Node.js $(node -v) installed"
    else
        print_error "Node.js 18+ required. Current version: $(node -v)"
        exit 1
    fi
else
    print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

# Check pnpm
if command_exists pnpm; then
    print_status "pnpm $(pnpm -v) installed"
else
    print_warning "pnpm not found. Installing pnpm..."
    npm install -g pnpm
    print_status "pnpm installed"
fi

# Check for Docker or PostgreSQL
USING_DOCKER=false
if command_exists docker; then
    print_status "Docker found - will use Docker for PostgreSQL"
    USING_DOCKER=true
elif command_exists psql; then
    print_status "PostgreSQL found locally"
else
    print_warning "Neither Docker nor PostgreSQL found."
    print_info "Please install Docker (recommended) or PostgreSQL to proceed."
    print_info "Docker: https://docs.docker.com/get-docker/"
    print_info "PostgreSQL: https://www.postgresql.org/download/"
    exit 1
fi

# Check Git
if command_exists git; then
    print_status "Git $(git --version | cut -d' ' -f3) installed"
else
    print_error "Git is not installed. Please install Git."
    exit 1
fi

echo -e "\n${BLUE}Installing dependencies...${NC}\n"

# Install dependencies
pnpm install

print_status "Dependencies installed"

# Setup environment variables
echo -e "\n${BLUE}Setting up environment variables...${NC}\n"

if [ ! -f .env.local ]; then
    if [ -f .env.example ]; then
        cp .env.example .env.local
        print_status "Created .env.local from .env.example"
    else
        # Create a basic .env.local file
        cat > .env.local << 'EOF'
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/personal_website_dev"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-change-in-production-32"

# Admin credentials (for seeding)
ADMIN_EMAIL="admin@localhost"
ADMIN_PASSWORD="dev-password-change-in-prod"

# Email (Resend) - Get your API key at https://resend.com
RESEND_API_KEY=""
EMAIL_FROM="noreply@localhost"
CONTACT_EMAIL="fertorresnavarrete@gmail.com"

# Feature flags
NEXT_PUBLIC_ENABLE_COMMENTS="true"
NEXT_PUBLIC_ENABLE_NEWSLETTER="true"
EOF
        print_status "Created .env.local with default development values"
    fi
    print_warning "Please review and update .env.local with your settings"
else
    print_status ".env.local already exists"
fi

# Start PostgreSQL via Docker if using Docker
if [ "$USING_DOCKER" = true ]; then
    echo -e "\n${BLUE}Setting up PostgreSQL with Docker...${NC}\n"

    # Check if docker-compose.yml exists
    if [ ! -f docker-compose.yml ]; then
        cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: personal_website_db
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: personal_website_dev
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
EOF
        print_status "Created docker-compose.yml"
    fi

    # Start the database
    print_info "Starting PostgreSQL container..."
    docker-compose up -d postgres

    # Wait for PostgreSQL to be ready
    print_info "Waiting for PostgreSQL to be ready..."
    sleep 5

    # Check if PostgreSQL is responding
    for i in {1..10}; do
        if docker exec personal_website_db pg_isready -U postgres >/dev/null 2>&1; then
            print_status "PostgreSQL is ready"
            break
        fi
        if [ $i -eq 10 ]; then
            print_error "PostgreSQL failed to start. Check Docker logs."
            exit 1
        fi
        sleep 2
    done
fi

# Run Prisma migrations
echo -e "\n${BLUE}Setting up database...${NC}\n"

# Check if prisma directory exists
if [ -d prisma ]; then
    print_info "Running Prisma migrations..."
    pnpm prisma migrate dev --name init 2>/dev/null || pnpm prisma db push
    print_status "Database schema synced"

    # Generate Prisma client
    pnpm prisma generate
    print_status "Prisma client generated"
else
    print_warning "Prisma schema not found. Database setup skipped."
    print_info "Run 'pnpm prisma init' to initialize Prisma after creating the schema."
fi

# Seed database if seed script exists
if [ -f prisma/seed.ts ] || [ -f prisma/seed.js ]; then
    print_info "Seeding database..."
    pnpm prisma db seed 2>/dev/null || print_warning "Database seeding skipped or failed"
fi

# Copy content assets if they exist
echo -e "\n${BLUE}Setting up content assets...${NC}\n"

if [ -d content ]; then
    # Create public directories if they don't exist
    mkdir -p public/images/blog
    mkdir -p public/images/projects
    mkdir -p public/downloads

    # Copy profile photo if exists
    if [ -f content/profile-photo.jpg ]; then
        cp content/profile-photo.jpg public/images/fernando-torres.jpg
        print_status "Copied profile photo"
    fi

    # Copy resume if exists
    if [ -f content/Profile.pdf ]; then
        cp content/Profile.pdf public/downloads/Fernando_Torres_Resume.pdf
        print_status "Copied resume"
    fi

    # Copy deliverable images if they exist
    if [ -d content/deliverables/images ]; then
        cp -r content/deliverables/images/* public/images/blog/ 2>/dev/null || true
        print_status "Copied blog images"
    fi
else
    print_warning "Content directory not found. Skipping asset setup."
fi

# Build check (optional - comment out for faster init)
# echo -e "\n${BLUE}Running build check...${NC}\n"
# pnpm build && print_status "Build successful" || print_warning "Build had issues"

# Final summary
echo -e "\n${GREEN}=============================================="
echo "  Setup Complete!"
echo "==============================================${NC}\n"

echo -e "Next steps:"
echo -e "  1. Review ${YELLOW}.env.local${NC} and update any values"
echo -e "  2. Run ${YELLOW}pnpm dev${NC} to start the development server"
echo -e "  3. Open ${BLUE}http://localhost:3000${NC} in your browser"
echo ""
echo -e "Useful commands:"
echo -e "  ${YELLOW}pnpm dev${NC}           - Start development server"
echo -e "  ${YELLOW}pnpm build${NC}         - Build for production"
echo -e "  ${YELLOW}pnpm lint${NC}          - Run ESLint"
echo -e "  ${YELLOW}pnpm typecheck${NC}     - Run TypeScript checks"
echo -e "  ${YELLOW}pnpm test${NC}          - Run tests"
echo -e "  ${YELLOW}pnpm prisma studio${NC} - Open database GUI"
echo ""
echo -e "Access points:"
echo -e "  Main site:      ${BLUE}http://localhost:3000${NC}"
echo -e "  Admin:          ${BLUE}http://localhost:3000/admin${NC}"
echo -e "  Prisma Studio:  ${BLUE}http://localhost:5555${NC} (run: pnpm prisma studio)"
echo ""

# Ask if user wants to start dev server
read -p "Start development server now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "\n${BLUE}Starting development server...${NC}\n"
    pnpm dev
fi
