# Crypton

A modern cryptocurrency and stock market dashboard with AI-powered predictions and real-time data visualization.


## Features

- **Real-time Market Data**: Track cryptocurrencies and stocks with up-to-date information
- **Interactive Dashboard**: Visual representation of market trends and performance metrics
- **AI-Powered Predictions**: Get future price predictions for major cryptocurrencies
- **Market Sentiment Analysis**: Understand market sentiment through data-driven insights
- **Personalized Watchlist**: Create and monitor your own custom asset list
- **Gemini AI Chat**: Ask questions and get market insights from an AI assistant

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **UI Components**: Shadcn UI, Tailwind CSS
- **Data Visualization**: Recharts
- **AI Integration**: Google Gemini API
- **Market Data**: CoinGecko API

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API key (for AI features)
- CoinGecko API key (for market data)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/crypton.git
cd crypton
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Then edit `.env.local` to add your API keys.

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

### Building for Production

```bash
npm run build
npm run start
# or
yarn build
yarn start
```

## Project Structure

```
crypton/
├── public/            # Static assets
├── src/               # Source code
│   ├── app/           # Next.js app directory
│   ├── components/    # Reusable components
│   │   ├── charts/    # Chart components
│   │   ├── dashboard/ # Dashboard components
│   │   ├── layouts/   # Layout components
│   │   ├── ui/        # UI components (Shadcn)
│   │   ├── lib/       # Utility functions
│   │   ├── services/  # API services
│   │   ├── store/     # State management
│   │   ├── styles/    # Global styles
│   ├── .env.example   # Example environment variables
│   ├── next.config.js # Next.js configuration
│   ├── package.json   # Dependencies and scripts
│   └── README.md      # Project documentation
```

## Deployment to Render

This application is configured for easy deployment to Render without Docker.

### Deploy via GitHub

1. Fork or push this repository to your GitHub account
2. Create a new Web Service on Render.com
3. Connect your GitHub repository
4. Configure as follows:
   - **Name**: Choose a name for your application
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**: Set up the following environment variables in the Render dashboard:
     - `NEXT_PUBLIC_GEMINI_API_KEY` - Your Gemini API key
     - `NEXT_PUBLIC_COINGECKO_API_KEY` - Your CoinGecko API key
     - `NEXT_PUBLIC_APP_URL` - The URL of your deployed application (will be provided by Render)

### Deploy using render.yaml

1. Fork or push this repository to your GitHub account
2. Create a new Blueprint on Render.com
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file and set up the service
5. Configure your environment variables in the Render dashboard

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [CoinGecko API](https://www.coingecko.com/en/api)
- [Google Gemini API](https://ai.google.dev/)
