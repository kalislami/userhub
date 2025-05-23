# TurboRepo Monorepo – Next.js + Express.js

This monorepo is built using [TurboRepo](https://turbo.build/repo) and contains two main applications:

- `apps/frontend`: Frontend built with [Next.js](https://nextjs.org/)
- `apps/backend`: Backend built with [Express.js](https://expressjs.com/)
- `packages/`: (Optional) Shared utilities

---

## Technologies Used

- Node.js + TypeScript
- Express.js
- Next.js
- Firebase

---
## Prerequisites
Before running the App, make sure you have installed the following:
- [Node.js](https://nodejs.org/)
- [Firebase CLI](http://firebase.google.com/docs/cli)
- [TurboRepo CLI (optional)](https://turbo.build/repo/docs/handbook/installing) (if you want to run turbo commands globally)

## Running the Application
#### Set up the .env file in the backend folder (refer to env.example for values).

### 1. Development mode

#### Using Firebase Cloud
- Set up the .env file for Firebase Cloud.
- **Run the following commands:**
```bash
npm run dev
   ```
#### Using Firebase Emulator (Partially)
- Set up the .env file for Firebase Emulator.
- **Run the following commands:**
```bash
cd apps/backend
npm run dev -- with-emulator

cd apps/frontend
npm run dev
   ```

### 2. Build Mode

#### Using Firebase Cloud
- Set up the .env file for Firebase Cloud.
- **Run the following commands:**
```bash
npm run build
npm start
   ```

#### Using Firebase Emulator (Partially)
- Set up the .env file for Firebase Emulator.
- **Run the following commands:**
```bash
cd apps/backend
npm run build # skip if already built
npm start -- with-emulator

cd apps/frontend
npm run build # skip if already built
npm start
   ```

---

## Licence
#### This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contributing
#### Please fork the repo and submit pull requests for contributions.

---

## Contact
#### For questions, contact me at [email](mailto:kamalgoritm@gmail.com).