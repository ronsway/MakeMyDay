# 🌟 ParentFlow (MakeMyDay)

**Hebrew language parent communication system** that automatically parses WhatsApp/email messages from schools and converts them into structured tasks and events, saving parents valuable time.

## 👥 Team

- **[Ron Lederer](https://github.com/ronsway)** - Lead Developer
- **Dana Tchetchik** - Product Manager

## 🎯 Project Overview

ParentFlow is a proof-of-concept application designed to help Israeli parents manage school communications more efficiently. The system uses Hebrew Natural Language Processing to extract actionable tasks and events from parent group messages.

### Key Capabilities

- 📝 **Hebrew NLP Processing** - Extracts tasks and events from Hebrew text
- 📅 **Smart Date Resolution** - Handles Hebrew date expressions (מחר, יום רביעי, etc.)
- 🎯 **Task Categorization** - Automatically categorizes items (ציוד, שיעורי בית, תשלום, מתנה)
- 📊 **Time-Saving Analytics** - Tracks how much time the system saves parents
- � **RTL Hebrew Interface** - Full right-to-left layout with Hebrew typography
- 📱 **Responsive Design** - Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ronsway/MakeMyDay.git
cd MakeMyDay

# Install dependencies
npm install

# Set up the database
npm run db:migrate

# Start the application
npm start
```

### Smart Startup (Recommended)

Use the intelligent startup script for the best development experience:

```powershell
# Windows PowerShell
.\run_all.ps1

# Or use the batch file
run_all.bat

# Or use npm
npm start
```

The startup script automatically:

- 🧹 Cleans up any leftover processes
- 🎨 Opens color-coded terminals (Frontend + Backend)
- 📐 Positions windows for easy monitoring
- 🔍 Detects and starts available services

## 🏗️ Architecture

```batch
# Double-click to run
run_all.bat

# Or use PowerShell
.\run_all.ps1

# Or use npm
npm start
```

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development and building
- **RTL Support** for Hebrew text layout
- **Date-fns** for Hebrew date handling
- **i18next** for internationalization

### Backend

- **Fastify** API server with TypeScript
- **Prisma** ORM with SQLite database
- **Zod** for request validation
- **Hebrew NLP** custom parser

### Core Components

- **Hebrew Text Parser** (`nlp/parser.ts`) - Extracts tasks and events
- **Date Resolver** (`nlp/date-resolver.ts`) - Handles Hebrew dates
- **Task Categorizer** (`nlp/category-mapper.ts`) - Classifies content
- **API Server** (`server/api.ts`) - RESTful endpoints
- **React Interface** (`web/MyDay.tsx`) - RTL Hebrew UI

## 📖 Documentation

- **[POC Specification](docs/POC_SPEC.md)** - Complete technical specification
- **[Version Management](docs/VERSION_MANAGEMENT.md)** - Version control and features
- **[API Documentation](docs/API_SPEC.md)** - REST API endpoints
- **[Architecture Guide](docs/ARCHITECTURE.md)** - System design
- **[Tech Stack](docs/TECH_STACK.md)** - Technology choices
- **[Startup Guide](docs/STARTUP_GUIDE.md)** - Development setup

## 🧪 Testing

```bash
# Run Hebrew NLP tests
npm run test:nlp

# Run all tests
npm test

# Test API endpoints
npm run test:api

# Version compatibility check
npm run version:check
```

## 📱 Usage Example

**Input** (Hebrew WhatsApp message):

```text
להביא ציוד ספורט ביום רביעי הקרוב. 
פגישת הורים מחר ב-14:00 בכיתה.
חובה להביא תשלום שכר לימוד עד יום ראשון.
```

**Output** (Structured data):

- ✅ **Task**: להביא ציוד ספורט (Wednesday, High Priority, Equipment)
- 📅 **Event**: פגישת הורים (Tomorrow 14:00, Location: בכיתה)
- 💳 **Task**: תשלום שכר לימוד (By Sunday, High Priority, Payment)

## 🚀 Available Scripts

- `npm start` - **Smart startup** (recommended)
- `npm run dev` - Start development servers
- `npm run dev:web` - Frontend only
- `npm run dev:api` - Backend only  
- `npm run build` - Production build
- `npm run test` - Run test suite
- `npm run lint` - Code linting
- `npm run db:migrate` - Database migrations
- `npm run version:check` - Version compatibility check

## 📁 Project Structure

```text
/
├── scripts/                    # Utility scripts
│   ├── demo-poc.ts            # Complete demo workflow
│   ├── test-nlp.ts            # Hebrew NLP test suite  
│   └── version-check.ts       # Version validation
├── server/                    # Backend API
│   ├── api.ts                 # Fastify server
│   ├── version.ts             # Version management
│   └── db.ts                  # Database connection
├── nlp/                       # Hebrew NLP processing
│   ├── parser.ts              # Main text parser
│   ├── date-resolver.ts       # Hebrew date handling
│   └── category-mapper.ts     # Content classification
├── web/                       # React frontend
│   ├── MyDay.tsx              # Main RTL interface
│   ├── MyDay.css              # Hebrew typography & RTL
│   ├── versionManager.ts      # Client version handling
│   └── VersionDisplay.tsx     # Version UI components
├── docs/                      # Documentation
├── prisma/                    # Database schema
└── data/                      # SQLite database
```

## 🔧 Configuration

### Environment Variables

```bash
# Database
DATABASE_URL="file:./data/parentflow.db"

# Timezone
TZ="Asia/Jerusalem"

# Version
VITE_APP_VERSION="0.1.0"

# Development
NODE_ENV="development"
```

### Version Management

ParentFlow includes comprehensive version management:

- **API Versioning**: Backward compatible endpoints
- **Feature Flags**: Version-based feature rollouts  
- **Update Notifications**: In-app update prompts
- **Compatibility Checking**: Automatic client-server validation

See [Version Management](docs/VERSION_MANAGEMENT.md) for details.

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow Hebrew text processing best practices
- Maintain RTL layout compatibility
- Include tests for Hebrew NLP features
- Update documentation for new features
- Ensure TypeScript type safety

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Hebrew Date Processing** - Custom implementations for Israeli calendar
- **RTL Layout** - Community best practices for Hebrew interfaces
- **NLP Patterns** - Based on real parent communication analysis
- **Israeli Education System** - Feedback from actual parent groups

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/ronsway/MakeMyDay/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ronsway/MakeMyDay/discussions)
- **Documentation**: [Project Wiki](https://github.com/ronsway/MakeMyDay/wiki)

---

**Made with ❤️ for Israeli parents by [Ron Lederer](https://github.com/ronsway) and Dana Tchetchik**
