// frontend/src/routes/ComponentTest.tsx
import { useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Textarea from '../components/Textarea';

export default function ComponentTest() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  const categoryOptions = [
    { value: 1, label: 'Math' },
    { value: 2, label: 'Entertainment' },
    { value: 3, label: 'History' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);
    console.log('Form submitted:', { email, password, category, description });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem', fontFamily: 'Baloo 2, sans-serif' }}>
      <h1 style={{ color: '#004b74', marginBottom: '2rem' }}>🎨 Component Test Page</h1>

      {/* Buttons Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: '#0F766E', marginBottom: '1rem' }}>Buttons</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <Button variant="primary" size="small">Small</Button>
          <Button variant="primary" size="medium">Medium</Button>
          <Button variant="primary" size="large">Large</Button>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="primary" disabled>Disabled Primary</Button>
          <Button variant="secondary" disabled>Disabled Secondary</Button>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <Button variant="primary" fullWidth>Full Width Button</Button>
        </div>
      </section>

      {/* Form Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: '#0F766E', marginBottom: '1rem' }}>Form Components</h2>
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            hint="We'll never share your email"
            error={showErrors && !email ? 'Email is required' : undefined}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={showErrors && password.length < 8 ? 'Password must be at least 8 characters' : undefined}
            required
          />

          <Select
            label="Category"
            options={categoryOptions}
            placeholder="Choose a category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            hint="Select the quiz category"
            error={showErrors && !category ? 'Please select a category' : undefined}
            required
          />

          <Textarea
            label="Description"
            placeholder="Describe your quiz..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            hint="Maximum 500 characters"
            error={showErrors && !description ? 'Description is required' : undefined}
            required
          />

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="primary" type="submit">
              Submit Form
            </Button>
            <Button 
              variant="secondary" 
              type="button"
              onClick={() => {
                setEmail('');
                setPassword('');
                setCategory('');
                setDescription('');
                setShowErrors(false);
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      </section>

      {/* Disabled State Section */}
      <section>
        <h2 style={{ color: '#0F766E', marginBottom: '1rem' }}>Disabled States</h2>
        <Input
          label="Disabled Input"
          placeholder="This is disabled"
          disabled
          value="Cannot edit this"
        />
        <Select
          label="Disabled Select"
          options={categoryOptions}
          disabled
          value={1}
        />
        <Textarea
          label="Disabled Textarea"
          placeholder="This is disabled"
          disabled
          value="Cannot edit this text area"
        />
      </section>

      {/* Add after the existing button section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: '#0F766E', marginBottom: '1rem' }}>Additional Actions</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <Button variant="danger">Delete Quiz</Button>
          <Button variant="success">Publish Quiz</Button>
          <Button variant="gray">Cancel</Button>
          <Button variant="link">Add Option</Button>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="primary" size="icon">↑</Button>
          <Button variant="primary" size="icon">↓</Button>
          <Button variant="danger" size="icon">✕</Button>
        </div>
      </section>
    </div>
  );
}