// frontend/src/routes/ComponentTest.tsx
import { useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Textarea from '../components/Textarea';
import QuizCard from '../components/QuizCard';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import StatCard from '../components/StatCard';
import Mascot from '../components/Mascot';
import Badge from '../components/Badge';
import Clouds from '../components/Clouds';

export default function ComponentTest() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');

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
    <>
      <Clouds />
      <div style={{ 
        maxWidth: '1200px', 
        margin: '2rem auto', 
        padding: '2rem', 
        fontFamily: 'Baloo 2, sans-serif',
        position: 'relative',
        zIndex: 1,
      }}>
        <h1 style={{ color: '#004b74', marginBottom: '2rem', textAlign: 'center' }}>
          🎨 Component Test Page
        </h1>

        {/* Mascots Section */}
        <section style={{ marginBottom: '3rem', background: 'white', padding: '2rem', borderRadius: '12px' }}>
          <h2 style={{ color: '#0F766E', marginBottom: '1rem' }}>Mascots</h2>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <Mascot variant="blueberry" size="small" />
              <p>Small Blueberry</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Mascot variant="celebrate" size="medium" />
              <p>Medium Celebrate</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Mascot variant="no-arms" size="large" />
              <p>Large No Arms</p>
            </div>
          </div>
        </section>

        {/* Badges Section */}
        <section style={{ marginBottom: '3rem', background: 'white', padding: '2rem', borderRadius: '12px' }}>
          <h2 style={{ color: '#0F766E', marginBottom: '1rem' }}>Badges</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Badge variant="default">Default</Badge>
            <Badge variant="difficulty">Easy</Badge>
            <Badge variant="category">Math</Badge>
            <Badge variant="success">Completed</Badge>
            <Badge variant="danger">Failed</Badge>
          </div>
        </section>

        {/* Stats Section */}
        <section style={{ marginBottom: '3rem', background: 'white', padding: '2rem', borderRadius: '12px' }}>
          <h2 style={{ color: '#0F766E', marginBottom: '1rem' }}>Stat Cards</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <StatCard number={15} label="Created" variant="primary" />
            <StatCard number={32} label="Taken" variant="primary" />
            <StatCard number="87%" label="Success Rate" variant="secondary" />
          </div>
        </section>

        {/* Search & Filters Section */}
        <section style={{ marginBottom: '3rem', background: 'white', padding: '2rem', borderRadius: '12px' }}>
          <h2 style={{ color: '#0F766E', marginBottom: '1rem' }}>Search & Filters</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search quizzes..."
            />
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <FilterDropdown
                label="Category"
                options={['Math', 'Entertainment', 'History', 'Science']}
                selected={selectedFilter}
                onSelect={setSelectedFilter}
              />
              <FilterDropdown
                label="Difficulty"
                options={['Easy', 'Medium', 'Hard']}
                onSelect={(val) => console.log('Selected:', val)}
              />
              <FilterDropdown
                label="Grade Level"
                options={['Grade 1-3', 'Grade 4-6', 'Grade 7-9']}
                onSelect={(val) => console.log('Selected:', val)}
              />
            </div>
          </div>
        </section>

        {/* Quiz Cards Section */}
        <section style={{ marginBottom: '3rem', background: 'white', padding: '2rem', borderRadius: '12px' }}>
          <h2 style={{ color: '#0F766E', marginBottom: '1rem' }}>Quiz Cards</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <QuizCard
              id={1}
              title="Geometry Basics"
              imageUrl="/images/geometry.jpeg"
              difficulty="medium"
              questionCount={10}
              onTakeQuiz={() => alert('Taking Geometry quiz!')}
            />
            <QuizCard
              id={2}
              title="Disney Characters"
              imageUrl="/images/disney.webp"
              difficulty="easy"
              questionCount={8}
              onTakeQuiz={() => alert('Taking Disney quiz!')}
            />
            <QuizCard
              id={3}
              title="World History"
              difficulty="hard"
              questionCount={15}
              onTakeQuiz={() => alert('Taking History quiz!')}
            />
          </div>
        </section>

        {/* Buttons Section */}
        <section style={{ marginBottom: '3rem', background: 'white', padding: '2rem', borderRadius: '12px' }}>
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
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <Button variant="danger">Delete Quiz</Button>
            <Button variant="success">Publish Quiz</Button>
            <Button variant="gray">Cancel</Button>
            <Button variant="link">Add Option</Button>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <Button variant="primary" size="icon">↑</Button>
            <Button variant="primary" size="icon">↓</Button>
            <Button variant="danger" size="icon">✕</Button>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <Button variant="primary" disabled>Disabled Primary</Button>
            <Button variant="secondary" disabled>Disabled Secondary</Button>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <Button variant="primary" fullWidth>Full Width Button</Button>
          </div>
        </section>

        {/* Form Section */}
        <section style={{ marginBottom: '3rem', background: 'white', padding: '2rem', borderRadius: '12px' }}>
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
        <section style={{ background: 'white', padding: '2rem', borderRadius: '12px' }}>
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
      </div>
    </>
  );
}