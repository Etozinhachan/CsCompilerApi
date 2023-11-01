namespace ApiTest3
{
    public static class DefaultCode
    {
        public static string defaultLibs { get; } = "using System;\nusing System.IO;\n";
        public static string defaultClassStart { get; } = "namespace meowzer;\npublic class Program{\n";
        //need to think of a way to make the file path absolute but relative at the same time, cause it needs to be relative to the api's exe, but absolute to te dynamic assembly code :/

        
        public static string exeDirectory = AppDomain.CurrentDomain.BaseDirectory;
        public static string filePath = Path.Combine(exeDirectory, "ConsoleOutput.txt");
        public static string filePath2 = filePath.Replace("\\", "\\\\");
        public static string[] defaultMethods { get; } = new string[] {"static string filePath = " + $"\"{filePath2}\";" + "\n",
            "public static void WriteLine(string message){\nusing(StreamWriter sw = new StreamWriter(filePath, true)){\nsw.WriteLine(message);\n}\n}\n",
            "public static void Write(string message){\nusing(StreamWriter sw = new StreamWriter(filePath, true)){\nsw.Write(message);\n}\n}\n"/*,
            "public static string getPath(){\n return filePath;\n}\n"*/
        };
        public static string defaultClassEnd { get; } = "}\n";
    }
}
