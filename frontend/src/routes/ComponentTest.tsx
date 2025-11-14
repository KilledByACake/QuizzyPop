import { useState, type FormEvent } from 'react';
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
import Card from '../components/Card';
import Modal from '../components/Modal';
import Loader from '../components/Loader';

export default function ComponentTest() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categoryOptions = [
    { value: '1', label: 'Math' },
    { value: '2', label: 'Entertainment' },
    { value: '3', label: 'History' }
  ];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
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

        {/* NEW COMPONENTS */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: '#0F766E', marginBottom: '1rem' }}>Card Components</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <Card variant="default">
              <h3>Default Card</h3>
              <p>This is a default card with subtle shadow.</p>
            </Card>
            <Card variant="elevated">
              <h3>Elevated Card</h3>
              <p>This card has more shadow and lifts on hover.</p>
            </Card>
            <Card variant="outlined">
              <h3>Outlined Card</h3>
              <p>This card has a border instead of shadow.</p>
            </Card>
          </div>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: '#0F766E', marginBottom: '1rem' }}>Modal</h2>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Open Modal
          </Button>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Example Modal"
            footer={
              <>
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                  Confirm
                </Button>
              </>
            }
          >
            <p>This is the modal body. You can put any content here!</p>
            <Input label="Test Input" placeholder="Try typing..." />
          </Modal>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: '#0F766E', marginBottom: '1rem' }}>Loaders</h2>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Loader size="small" />
            <Loader size="medium" text="Loading..." />
            <Loader size="large" text="Please wait..." />
          </div>
        </section>

        {/* EXISTING COMPONENTS */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: '#0F766E', marginBottom: '1rem' }}>Buttons</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="success">Success</Button>
            <Button variant="gray">Gray</Button>
            <Button variant="link">Link</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: '#0F766E', marginBottom: '1rem' }}>Form Inputs</h2>
          <div style={{ maxWidth: '400px' }}>
            <Input label="Email" type="email" placeholder="Enter email" />
            <Input label="Password" type="password" error="Password is required" />
            <Select
              label="Category"
              options={[
                { value: '', label: 'Select category' },
                { value: 'math', label: 'Math' },
                { value: 'science', label: 'Science' }
              ]}
            />
            <Textarea label="Description" placeholder="Enter description" />
          </div>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: '#0F766E', marginBottom: '1rem' }}>Search & Filter</h2>
            <div style={{ display: 'flex', gap: '1rem', maxWidth: '600px' }}>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search quizzes..."
            />
            <FilterDropdown
              label="Filter"
              selected={selectedFilter}
              onSelect={setSelectedFilter}
              options={['all', 'math', 'science']}
            />
            </div>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: '#0F766E', marginBottom: '1rem' }}>Quiz Card</h2>
          <div style={{ maxWidth: '350px' }}>
            <QuizCard
              id={1}
              title="Math Quiz"
              imageUrl="/images/geometry.jpeg"
              difficulty="medium"
              questionCount={10}
              onTakeQuiz={() => alert('Taking quiz!')}
            />
          </div>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: '#0F766E', marginBottom: '1rem' }}>Stats</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <StatCard label="Total Quizzes" number={42} variant="primary" />
            <StatCard label="Completed" number={28} variant="secondary" />
          </div>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: '#0F766E', marginBottom: '1rem' }}>Badges</h2>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Badge>Default</Badge>
            <Badge variant="difficulty">Difficulty</Badge>
            <Badge variant="category">Category</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="danger">Danger</Badge>
          </div>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: '#0F766E', marginBottom: '1rem' }}>Mascots</h2>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Mascot variant="blueberry" size="small" />
            <Mascot variant="celebrate" size="medium" />
            <Mascot variant="no-arms" size="large" />
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
            readOnly
          />
          <Select
            label="Disabled Select"
            options={categoryOptions}
            disabled
            value="1"
          />
          <Textarea
            label="Disabled Textarea"
            placeholder="This is disabled"
            disabled
            value="Cannot edit this text area"
            readOnly
          />
        </section>
      </div>
    </>
  );
}
