namespace QuizzyPop.Utils
{
    public static class CategoryImageProvider
    {
        private static readonly Dictionary<string, string> CategoryImages = new()
        {
            ["Math"] = "/images/categories/math.jpg",           //Bilde=Matte, Av Ehler. M, Kilde:https://www.pexels.com/photo/red-background-with-123456789-text-overlay-1329296/
            ["History"] = "/images/categories/history.jpg",     //Bilde=History, Av Pixabay, Kilde:https://www.pexels.com/photo/silver-knight-helmet-289831/
            ["Science"] = "/images/categories/science.jpg",     //Bilde=Science, Av Clix. R, Kilde:https://www.pexels.com/photo/several-laboratory-glasses-1366944/ 
            ["Geography"] = "/images/categories/geography.jpg", //Bilde=Geography, Av Arralyn, Kilde:https://www.pexels.com/photo/great-sphynx-of-giza-egypt-2402926/ 
            ["Entertainment"] = "/images/categories/entertainment.jpg",  //Bilde=Entertainment, Av Pixabay, Kilde:https://www.pexels.com/photo/white-and-black-clapper-board-274937/ 
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
