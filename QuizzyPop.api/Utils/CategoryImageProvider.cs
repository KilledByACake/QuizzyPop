namespace QuizzyPop.Utils
{
    public static class CategoryImageProvider
    {
        private static readonly Dictionary<string, string> CategoryImages = new()
        {
            ["Math"] = "/images/categories/math.jpg",
            ["History"] = "/images/categories/history.jpg",
            ["Science"] = "/images/categories/science.jpg",
            ["Geography"] = "/images/categories/geography.jpg",
            ["Entertainment"] = "/images/categories/entertainment.jpg",
        };

        public static string GetImageForCategory(string categoryName)
        {
            if (CategoryImages.TryGetValue(categoryName, out var url))
                return url;

            // fallback
            return "/images/categories/default.jpg";
        }
    }
}
