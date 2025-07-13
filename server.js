import express from 'express';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/thecompendium', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('MongoDB connected!');
});

// Test schema and model
const TestSchema = new mongoose.Schema({ name: String });
const Test = mongoose.model('Test', TestSchema);

// Test route to insert a document
app.get('/test-mongo', async (req, res) => {
  const doc = await Test.create({ name: 'Hello Compendium' });
  res.json(doc);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 