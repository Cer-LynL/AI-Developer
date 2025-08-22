# Autonomous Developer Agent Demo

A comprehensive demo system showcasing an AI-powered autonomous developer agent that integrates with Git repositories, analyzes commits using LLM (Ollama), and automatically proposes fixes and improvements through pull requests.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### 1. Start Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Backend runs on `http://localhost:8000`

### 2. Start Frontend
```bash
cd frontend
npm install
npm start
```
Frontend runs on `http://localhost:3000`

### 3. Demo Repository
```bash
cd demo_repo
pip install -r requirements.txt
python run_tests.py  # Shows failing tests
```

## 🎮 Demo Flow

1. **Connect Repository**: Navigate to "Repositories" → "Connect Repository"
2. **Trigger Analysis**: Click "Trigger Demo" on dashboard
3. **Watch Processing**: View real-time logs in "Jobs" section
4. **Review Results**: See generated pull requests and improvements

## 📁 Project Structure

```
├── backend/           # Python FastAPI backend
│   ├── app.py        # Main application
│   ├── agent.py      # Core autonomous agent
│   ├── models.py     # Data models
│   └── *_client.py   # Mock integrations
├── frontend/         # React dashboard
│   ├── src/
│   │   ├── components/  # UI components
│   │   └── services/    # API layer
│   └── public/
├── demo_repo/        # Demo Python app with issues
│   ├── src/          # Application code
│   └── tests/        # Failing tests
└── docs/             # Comprehensive documentation
```

## 🎯 Features

- **Phase 1**: Error detection and automatic fixes
- **Phase 2**: Performance optimizations (O(n²) → O(n))
- **Phase 3**: Roadmap-aware development
- **Real-time Dashboard**: Live monitoring and job tracking
- **Mock Integrations**: Ollama, Slack, Jira, GitHub

## 📚 Documentation

See `docs/README.md` for comprehensive documentation including:
- Detailed setup instructions
- Architecture overview
- Demo script for presentations
- Troubleshooting guide

## 🎨 UI Design

- **Theme**: Dark with black/grey background
- **Accent**: Phthalo green (#00A86B)
- **Layout**: Professional enterprise dashboard
- **Updates**: Real-time status and animations

---

**Built for autonomous development workflows**
