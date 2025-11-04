# IP Escrow Backend API

A comprehensive backend API for a blockchain-based freelance platform with milestone payments, IP asset registration, and escrow management on Story Network.

## 🚀 Features

- **Wallet-Based Authentication**: Secure Web3 authentication using wallet signatures
- **Project Management**: Create, update, and manage freelance projects with milestone-based payments
- **Smart Contract Integration**: Direct integration with Story Network smart contracts
- **IPFS Storage**: Decentralized storage for project metadata and deliverables
- **IP Asset Registration**: Register and manage intellectual property on Story Protocol
- **Dispute Resolution**: Built-in dispute management system
- **Event Monitoring**: Real-time blockchain event listening and synchronization
- **Analytics**: Comprehensive project and user analytics
- **RESTful API**: Clean, well-documented REST API endpoints

## 📋 Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 6.0
- Story Network wallet with testnet IP tokens
- Pinata account (for IPFS)
- Story Protocol API key (optional)

## 🛠️ Installation

### 1. Clone the repository

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file and update with your credentials:

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/ip_escrow

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Story Network
STORY_RPC_URL=https://testnet.storyrpc.io
STORY_CHAIN_ID=1513

# Smart Contracts
PROJECT_FACTORY_ADDRESS=0x701dca87b35B0e65Ba8bE229878FDdA3887952b8
PRIVATE_KEY=your-backend-wallet-private-key

# IPFS (Pinata)
IPFS_JWT=your-pinata-jwt-token
IPFS_GATEWAY_URL=https://gateway.pinata.cloud/ipfs

# CORS
CORS_ORIGIN=http://localhost:5173
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# macOS (using Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 5. Start the server

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

#### Connect Wallet

```http
POST /api/auth/connect
Content-Type: application/json

{
  "walletAddress": "0x..."
}

Response:
{
  "status": "success",
  "data": {
    "nonce": "123456",
    "message": "Sign this message to authenticate with nonce: 123456"
  }
}
```

#### Verify Signature

```http
POST /api/auth/verify
Content-Type: application/json

{
  "walletAddress": "0x...",
  "signature": "0x...",
  "message": "Sign this message to authenticate with nonce: 123456"
}

Response:
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "walletAddress": "0x...",
      "username": null,
      "reputationScore": 0
    }
  }
}
```

#### Get Profile

```http
GET /api/auth/profile
Authorization: Bearer <token>

Response:
{
  "status": "success",
  "data": {
    "user": {
      "id": "...",
      "walletAddress": "0x...",
      "username": "johndoe",
      "email": "john@example.com",
      "reputationScore": 95,
      "stats": {
        "projectsCreated": 5,
        "projectsCompleted": 3,
        "totalEarned": "1000000000000000000"
      }
    }
  }
}
```

### Additional Endpoints

More endpoints will be available for:

- **Projects**: `/api/projects` - CRUD operations for projects
- **Milestones**: `/api/milestones` - Milestone management
- **Applications**: `/api/applications` - Collaborator applications
- **IP Assets**: `/api/ip` - IP registration and licensing
- **Disputes**: `/api/disputes` - Dispute management
- **Analytics**: `/api/analytics` - Platform analytics

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.js   # MongoDB connection
│   │   ├── blockchain.js # Web3 provider setup
│   │   └── ipfs.js       # IPFS client config
│   ├── models/           # Mongoose models
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Milestone.js
│   │   ├── Application.js
│   │   ├── Transaction.js
│   │   ├── IPAsset.js
│   │   └── Dispute.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   ├── projects.js   # (To be implemented)
│   │   ├── milestones.js # (To be implemented)
│   │   └── ...
│   ├── controllers/      # Business logic (To be implemented)
│   ├── middleware/       # Custom middleware
│   │   ├── auth.js       # Authentication
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── services/         # External services
│   │   ├── contractService.js  # Smart contract interactions
│   │   ├── eventListener.js    # Blockchain event monitoring
│   │   ├── ipfsService.js      # IPFS operations
│   │   └── storyService.js     # Story Protocol integration
│   ├── utils/            # Helper functions
│   │   ├── logger.js
│   │   ├── errors.js
│   │   └── validators.js
│   └── server.js         # Express app entry point
├── logs/                 # Application logs
├── .env                  # Environment variables
├── .env.example          # Example environment file
├── package.json
└── README.md
```

## 🔒 Security Features

- **Helmet.js**: Security headers
- **Rate Limiting**: Prevents abuse
- **MongoDB Sanitization**: Prevents NoSQL injection
- **Input Validation**: Express-validator for all inputs
- **JWT Authentication**: Secure token-based auth
- **Signature Verification**: Web3 signature verification
- **CORS Protection**: Configurable CORS policy

## 📝 Environment Variables

| Variable                  | Description                | Required                            |
| ------------------------- | -------------------------- | ----------------------------------- |
| `PORT`                    | Server port                | No (default: 5000)                  |
| `NODE_ENV`                | Environment mode           | No (default: development)           |
| `MONGODB_URI`             | MongoDB connection string  | Yes                                 |
| `JWT_SECRET`              | JWT signing secret         | Yes                                 |
| `JWT_EXPIRE`              | JWT expiration time        | No (default: 7d)                    |
| `STORY_RPC_URL`           | Story Network RPC endpoint | Yes                                 |
| `PROJECT_FACTORY_ADDRESS` | Smart contract address     | Yes                                 |
| `PRIVATE_KEY`             | Backend wallet private key | Yes                                 |
| `IPFS_JWT`                | Pinata JWT token           | Yes                                 |
| `CORS_ORIGIN`             | Allowed CORS origin        | No (default: http://localhost:5173) |

## 🚨 Error Handling

The API uses standardized error responses:

```json
{
  "status": "error",
  "message": "Error description"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error
- `503` - Service Unavailable

## 📊 Logging

Logs are stored in the `logs/` directory:

- `combined-YYYY-MM-DD.log` - All logs
- `error-YYYY-MM-DD.log` - Error logs only
- `exceptions-YYYY-MM-DD.log` - Uncaught exceptions
- `rejections-YYYY-MM-DD.log` - Unhandled promise rejections

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🔄 Blockchain Event Monitoring

The backend automatically listens to smart contract events:

- `ProjectCreated` - New project deployment
- `CollaboratorApproved` - Collaborator assigned
- `MilestoneSubmitted` - Deliverable submitted
- `MilestoneCompleted` - Payment released
- `ProjectCancelled` - Project cancellation

Events are processed and synced to the database automatically.

## 🛡️ Rate Limits

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes
- **Project Creation**: 10 per hour
- **Applications**: 20 per day
- **Disputes**: 3 per day

## 📦 Database Models

### User

- Wallet-based authentication
- Profile information
- Reputation scoring
- Statistics tracking

### Project

- Project metadata
- Milestone configuration
- Status management
- Blockchain integration

### Milestone

- Deliverable tracking
- Payment management
- Review system
- Version history

### Application

- Collaborator proposals
- Review workflow
- Approval tracking

### Transaction

- On-chain transaction records
- Payment tracking
- Analytics support

### IPAsset

- IP registration data
- Licensing information
- Royalty tracking
- Genealogy tree

### Dispute

- Dispute management
- Evidence tracking
- Resolution workflow

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License

## 👥 Support

For issues and questions:

- Create an issue on GitHub
- Contact the development team

## 🔮 Roadmap

- [ ] Complete all route implementations
- [ ] Add Swagger/OpenAPI documentation
- [ ] Implement WebSocket for real-time updates
- [ ] Add comprehensive test suite
- [ ] Performance optimization
- [ ] Production deployment guide
- [ ] Integration with Story Protocol SDK

---

**Built with ❤️ for the Web3 community**
