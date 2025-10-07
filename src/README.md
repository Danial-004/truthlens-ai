# TruthLens - Advanced Fake News Detection Platform

TruthLens is a comprehensive multilingual fake news detection platform powered by AI, built with React, TypeScript, Tailwind CSS, and Supabase. It supports English, Russian, and Kazakh languages and provides detailed explanations for each prediction.

## 🌟 Features

### Core Functionality
- **AI-Powered Detection**: Uses Hugging Face models for accurate fake news classification
- **Multilingual Support**: Supports English, Russian, and Kazakh text analysis
- **Real-time Analysis**: Instant text classification with confidence scores
- **Detailed Explanations**: Provides reasoning, highlighted keywords, and source verification
- **Source Verification**: Cross-references with trusted news sources

### User Experience
- **Modern UI**: Clean, responsive design with dark/light mode support
- **Language Switcher**: Seamless multilingual interface
- **User Authentication**: Secure signup/login with role-based access
- **Dashboard Analytics**: Personal prediction history and statistics
- **News Feed**: Curated articles from verified sources

### Admin Features
- **System Management**: Admin dashboard with comprehensive analytics
- **User Management**: Role-based access control (user/admin)
- **Source Management**: Trusted news source configuration
- **Demo Data**: Initialize sample data for testing

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Auth, Edge Functions)
- **AI/ML**: Hugging Face Inference API
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **UI Components**: Custom components with shadcn/ui

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account
- Hugging Face API key

### Environment Variables
Create a `.env` file with the following variables:

```env
# Supabase Configuration (auto-configured in Figma Make)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Hugging Face API
HF_API_KEY=your_hugging_face_api_key
```

### Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Hugging Face API**
   - Sign up at [Hugging Face](https://huggingface.co/)
   - Get your API key from settings
   - Add it to the HF_API_KEY secret in Supabase

3. **Initialize Demo Data**
   - Navigate to Admin Dashboard
   - Click "Initialize Demo Data"
   - This populates the system with sample articles and predictions

4. **Start Development**
   ```bash
   npm run dev
   ```

## 📖 Usage Guide

### For Users

1. **Text Analysis**
   - Navigate to "Check Text" page
   - Paste or upload text content
   - View classification results with confidence scores
   - Explore detailed explanations and highlighted keywords

2. **News Feed**
   - Browse verified articles from trusted sources
   - Filter by language and sort by relevance
   - View pre-analyzed articles with classification labels

3. **Dashboard**
   - Track your analysis history
   - View personal statistics and accuracy metrics
   - Monitor recent activity

### For Administrators

1. **System Overview**
   - Monitor total predictions and system accuracy
   - View classification breakdowns and trends
   - Track recent system activity

2. **User Management**
   - Manage user roles and permissions
   - Monitor user activity and engagement

3. **Source Configuration**
   - Add/remove trusted news sources
   - Configure scraping parameters
   - Monitor source reliability

## 🔧 Configuration

### ML Model Configuration
- **Primary Model**: facebook/bart-large-mnli
- **Confidence Threshold**: 70%
- **Supported Languages**: English, Russian, Kazakh
- **Classification Labels**: REAL, FAKE, UNCERTAIN

### Database Schema
The system uses a key-value store for simplicity:

```typescript
// Predictions
{
  id: string,
  text: string,
  classification: 'REAL' | 'FAKE' | 'UNCERTAIN',
  confidence: number,
  explanation: {
    reasoning: string,
    keywords: string[],
    sources: string[]
  },
  language: string,
  timestamp: string
}

// Articles
{
  id: string,
  title: string,
  content: string,
  url: string,
  language: string,
  source: string,
  published_at: string,
  classification?: string,
  confidence?: number
}
```

## 🌐 API Endpoints

### Public Endpoints
- `POST /predict` - Analyze text for fake news
- `GET /articles` - Fetch news articles feed

### Authenticated Endpoints
- `GET /predictions` - User's prediction history
- `GET /stats` - System statistics (admin only)
- `POST /signup` - User registration

## 🔒 Security & Privacy

- **Row Level Security**: Supabase RLS protects user data
- **Authentication**: Secure JWT-based auth with Supabase
- **API Rate Limiting**: Prevents abuse of ML endpoints
- **Data Privacy**: User data is encrypted and protected

## 🎨 Design System

### Colors
- **Primary**: Deep blue (#0f172a) to Teal (#06b6d4)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Typography
- **Font Family**: Inter (system fonts fallback)
- **Scale**: Responsive typography with consistent spacing

### Components
- Modern card-based layouts
- Gradient backgrounds and shadows
- Smooth animations and transitions
- Accessible color contrasts

## 🧪 Testing

### Demo Credentials
```
Email: demo@truthlens.ai
Password: demo123
```

### Sample Texts for Testing

**English (Real News)**:
```
Scientists at Stanford University have developed a new solar panel technology that can generate electricity even in low-light conditions. The innovation could revolutionize renewable energy adoption worldwide.
```

**Russian (Fake News)**:
```
Российские ученые создали вакцину от всех болезней. Группа исследователей заявляет о создании универсальной вакцины, которая может предотвратить все известные заболевания.
```

**Kazakh (Real News)**:
```
Қазақстан Республикасының энергетика министрлігі Каспий теңізінің батыс бөлігінде ірі мұнай кенішінің табылғанын хабарлады.
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

TruthLens is an educational and demonstration tool. While it uses advanced AI models for analysis, users should always verify important information with official sources and trusted news outlets. The system is designed for learning purposes and should not be the sole source for determining news authenticity.

## 🆘 Support

For support and questions:
- Check the documentation
- Review sample implementations
- Test with provided demo data
- Verify API configurations

## 🔄 Updates & Roadmap

### Current Version: 1.0.0
- Core fake news detection
- Multilingual support (EN/RU/KZ)
- User authentication and roles
- Admin dashboard
- News feed integration

### Planned Features
- Advanced NLP models
- Real-time news scraping
- Social media integration
- Batch analysis tools
- API rate limiting
- Enhanced source verification
- Mobile app development

---

Built with ❤️ using modern web technologies. TruthLens helps combat misinformation through AI-powered analysis and community verification.