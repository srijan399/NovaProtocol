# Insurance Onboarding Flow - Nova AI Assistant

This document outlines the complete insurance onboarding flow implemented in the Aegis project.

## Overview

The Nova AI assistant guides users through a conversational insurance purchase process, collecting all necessary information and creating blockchain-based insurance policies with optional auto-payment agents.

## Flow Structure

### 1. Initial Greeting
- Nova introduces herself as the AI insurance assistant
- Asks how she can help protect the user's crypto assets

### 2. Policy Selection
When user asks about insurance options, Nova presents:
- **Rug Pull Insurance** (High Risk - 8% annual premium)
- **Protocol Hack Insurance** (Medium Risk - 5% annual premium)  
- **Bridge Failure Insurance** (High Risk - 7% annual premium)

### 3. Information Collection
Nova collects information in this order:
1. **Coverage Amount**: How much ETH to insure
2. **Duration**: Policy length in months/years
3. **Payment Type**: Monthly premiums or lump sum
4. **Premium Calculation**: Based on risk level and coverage
5. **Auto-payment Agent**: Optional automatic payment handling

### 4. Policy Preview
- Shows comprehensive policy details in a dialog
- Includes all terms, premiums, and coverage information
- Requires user confirmation before blockchain deployment

### 5. Policy Creation
- Deploys policy to blockchain using smart contracts
- Creates auto-payment agent if requested
- Confirms successful policy activation

## Technical Implementation

### API Endpoints

#### `/api/chat` (POST)
Handles conversation with Nova AI assistant
- **Input**: Array of chat messages
- **Output**: AI response and optional preview data

#### `/api/agent` (POST/GET)  
Manages auto-payment agent creation and status
- **POST**: Creates new auto-payment agent
- **GET**: Retrieves agent status and payment history

### Key Components

#### `PolicyPreviewDialog`
Modal component displaying policy details before confirmation
- Shows all policy terms and conditions
- Calculates total costs and payment schedules
- Integrates with blockchain policy creation

#### `usePolicyManagement` Hook
Handles blockchain interactions for policy creation
- Manages smart contract calls
- Handles transaction states and errors
- Integrates with wagmi for Web3 functionality

#### Policy Utilities
Helper functions for calculations and validations
- Premium calculations based on risk levels
- Policy data validation
- Currency and duration formatting

### Smart Contract Integration

The system integrates with a `PolicyManager` smart contract that handles:
- Policy creation and storage
- Premium collection and management
- Policy lifecycle management
- Auto-payment agent coordination

### Data Flow

1. **User Input** → Chat API → **AI Processing**
2. **AI Response** → **Policy Data Collection**
3. **Complete Data** → **Preview Generation**
4. **User Confirmation** → **Smart Contract Deployment**
5. **Policy Active** → **Auto-agent Creation** (if selected)

## Risk Levels and Premiums

| Policy Type | Risk Level | Annual Premium Rate |
|-------------|------------|-------------------|
| Rug Pull Insurance | High | 8% |
| Protocol Hack Insurance | Medium | 5% |
| Bridge Failure Insurance | High | 7% |

## Payment Options

### Monthly Payments
- Premium split across policy duration
- Auto-payment agent handles scheduling
- Blockchain-based automation

### Lump Sum
- Single upfront payment
- Potential discount for full payment
- Immediate policy activation

## Auto-Payment Agent Features

- **Automated Scheduling**: Handles monthly premium payments
- **Blockchain Integration**: Smart contract-based execution
- **Balance Management**: Monitors and manages payment funds
- **Failure Handling**: Graceful handling of insufficient funds
- **Status Reporting**: Real-time payment status and history

## Error Handling

The system includes comprehensive error handling for:
- Invalid user inputs
- Blockchain transaction failures
- Network connectivity issues
- Smart contract interaction errors
- Auto-payment agent failures

## Security Considerations

- All transactions require user wallet confirmation
- Smart contracts are audited and secure
- Personal data is handled according to privacy standards
- Auto-payment agents use secure key management

## Future Enhancements

- Support for additional policy types
- Advanced risk assessment algorithms
- Integration with DeFi protocols
- Mobile app support
- Multi-chain compatibility
