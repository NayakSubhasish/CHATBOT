# NeuralChat

A sophisticated AI chatting application inspired by Claude and Perplexity AI, built with Next.js 14, TypeScript, React Query, and shadcn/ui. Features a beautiful minimalist black & white design with geometric background patterns.

**Crafted by Subhasish**

## ✨ Features

### 💬 Chat Interface
- **Streaming Responses**: Real-time token-by-token streaming using Google Gemini 2.0 Flash API
- **Claude-style Artifacts**: Inline rich blocks (code preview, markdown) that can be toggled between inline and expanded views
- **Dynamic Loading Indicators**: Beautiful wave pattern animations and "AI is thinking..." indicators during response generation
- **Local Persistence**: Chat history persists across page reloads using localStorage
- **Sticky Question Header**: Questions stay pinned at the top when scrolling long responses (Perplexity-style)
- **Inline Actions**: Copy, Regenerate, and Edit prompt functionality
- **Sidebar**: List and switch between previous chat sessions with timestamps

### 🔍 Intelligent Prompt Input
- **Server-Side Search**: Fetch initial results from API routes with intelligent autocomplete
- **Client-Side Caching**: Cache results using React Query for optimal performance
- **Character Highlighting**: Bold matched substrings in search results
- **Keyboard Navigation**: Full support for ↑ ↓ ↩ Esc keys
- **Mentions (@)**: Typing "@" triggers people search with 1M+ placeholder names through API

### 🎨 Design & UX
- **Geometric Background Pattern**: Subtle grey dot grid pattern similar to Perplexity
- **Elegant Branding**: Custom header with NeuralChat branding and creator signature
- **Black & White Theme**: Minimalist design with clean typography
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Polished transitions and loading states

### ⚙️ System Quality
- **Clean Architecture**: Modular folder structure (app/, components/, lib/, hooks/, types/)
- **Server Components**: Effective use of Next.js 14 App Router with Server Components
- **React Query**: Client-side data fetching and caching with TanStack Query
- **Error Handling**: Graceful error and empty state handling
- **Command Menu**: ⌘K (Cmd+K) menu with actions — "New Chat", "Clear History", "Settings"
- **Performance**: Optimized for production with code splitting and lazy loading

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **State Management**: React Query (TanStack Query v5)
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS with custom animations
- **Icons**: Lucide React
- **AI Provider**: Google Gemini 2.0 Flash API

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, pnpm, or yarn
- Google Gemini API Key ([Get one here](https://aistudio.google.com/))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/NayakSubhasish/CHATBOT.git
cd CHATBOT
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up Gemini API Key:
   - Create a `.env.local` file in the root directory
   - Add your API key: 
   ```
   GEMINI_API_KEY=your-api-key-here
   ```
   - The app includes a default key for demo purposes, but you should use your own for production

4. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
ChatBot/
├── app/
│   ├── api/              # API routes (chat, search, people)
│   │   ├── chat/         # Gemini API integration
│   │   ├── search/       # Search autocomplete
│   │   └── people/       # People mention search
│   ├── layout.tsx        # Root layout with providers
│   ├── page.tsx          # Main page component
│   ├── providers.tsx     # React Query provider
│   └── globals.css       # Global styles and patterns
├── components/
│   ├── chat/             # Chat interface components
│   │   ├── chat-interface.tsx
│   │   ├── chat-message.tsx
│   │   ├── artifact.tsx
│   │   ├── prompt-input.tsx
│   │   ├── sticky-header.tsx
│   │   └── streaming-loader.tsx
│   ├── sidebar/          # Sidebar components
│   │   └── chat-sidebar.tsx
│   ├── header/           # App header
│   │   └── app-header.tsx
│   ├── ui/               # shadcn/ui components
│   └── command-menu.tsx  # Command menu (⌘K)
├── hooks/
│   ├── use-chat.ts       # Chat state management
│   └── use-toast.ts      # Toast notifications
├── lib/
│   ├── storage.ts        # LocalStorage utilities
│   └── utils.ts          # Utility functions
└── types/
    └── index.ts          # TypeScript definitions
```

## 🎯 Key Features

### Real-Time Streaming
The app uses Google Gemini 2.0 Flash API for real AI responses with token-by-token streaming. Responses are displayed in real-time as they're generated.

### Sticky Question Header
When scrolling through long responses, the question header becomes sticky at the top of the viewport, just like Perplexity. This ensures context is always visible.

### Intelligent Autocomplete
The prompt input includes smart autocomplete that:
- Searches as you type
- Caches results for performance
- Highlights matching text
- Supports keyboard navigation
- Handles @ mentions for people search

### Command Menu
Press `⌘K` (or `Ctrl+K` on Windows/Linux) to access:
- New Chat
- Clear History
- Settings

## 🌐 Deployment to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: NeuralChat AI Application"
git branch -M main
git remote add origin https://github.com/NayakSubhasish/CHATBOT.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign in with your GitHub account
3. Click "Add New Project"
4. Import your repository: `NayakSubhasish/CHATBOT`
5. Configure environment variables:
   - Add `GEMINI_API_KEY` with your API key
6. Click "Deploy"

### Environment Variables

For Vercel deployment, add this environment variable:
- `GEMINI_API_KEY`: Your Google Gemini API key

The app will be automatically deployed and you'll get a live URL!

## 🔧 Configuration

### API Key Setup

For production, always use your own API key:
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Generate an API key
3. Add it to Vercel environment variables (for production) or `.env.local` (for development)

## 📱 Usage

1. **Start a Conversation**: Type a message in the input field
2. **View History**: Access previous chats from the sidebar
3. **Edit/Regenerate**: Hover over messages to see action buttons
4. **Command Menu**: Press `⌘K` for quick actions
5. **Search**: Use @ mentions to search for people
6. **Autocomplete**: Type to see intelligent search suggestions

## 🎨 Design Philosophy

NeuralChat follows a minimalist black & white design philosophy:
- Clean, elegant typography
- Subtle geometric patterns
- Focus on content readability
- Smooth animations and transitions
- Accessibility-first approach
- Professional branding

## 🔮 Future Enhancements

- [ ] Additional AI provider support (OpenAI, Anthropic)
- [ ] User authentication
- [ ] Cloud persistence (Firebase/Supabase)
- [ ] Export chat history (PDF/Markdown)
- [ ] Custom themes
- [ ] Voice input/output
- [ ] Multi-model comparison
- [ ] Chat sharing capabilities

## 📝 License

This project is created as a technical assignment by Subhasish.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- AI powered by [Google Gemini](https://ai.google.dev/)
- Inspired by Claude and Perplexity AI interfaces

---

**NeuralChat** - Crafted by Subhasish | v1.0
