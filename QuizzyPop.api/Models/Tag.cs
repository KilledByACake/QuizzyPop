namespace QuizzyPop.Models
{
    public class Tag
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public List<Quiz> Quizzes { get; set; } = new();
    }
}