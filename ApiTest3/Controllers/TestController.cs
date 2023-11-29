using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ApiTest3.Models;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.Emit;
using System.Reflection;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using System.Net;
using System.Text;

namespace ApiTest3.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class TestController : ControllerBase
    {


        [HttpPost]
        public JsonResult CompileCode(Code code)
        {
            if (!code.code.Contains("public static void Main(string[] args)"))
            {
                return new JsonResult(BadRequest("Missing Main(string[] args) method"));
            }
            using (StreamWriter sw = new StreamWriter(DefaultCode.filePath))
            {
                sw.Write("");
            }
            // Create a compilation context as before
            var compilation = CSharpCompilation.Create("MyDynamicAssembly")
                .WithOptions(new CSharpCompilationOptions(OutputKind.ConsoleApplication))
                .AddReferences(
                    MetadataReference.CreateFromFile(typeof(object).Assembly.Location)
                    //MetadataReference.CreateFromFile(typeof(System.Runtime.GCSettings).Assembly.Location) // Directly reference System.Runtime
                    //MetadataReference.CreateFromFile("..\\..\\..\\..\\MyHelperAssembly\\bin\\Debug\\net6.0\\MyExternalLibrary.dll") // Add reference to the helper assembly
                    //MetadataReference.CreateFromFile(typeof(Calculator).Assembly.Location) // Add reference to the helper assembly
                );

            string defaultMethods = "";
            foreach (string method in DefaultCode.defaultMethods)
            {
                defaultMethods += method;
            }
            string defaultCode = $"{DefaultCode.defaultLibs}{DefaultCode.defaultClassStart}{defaultMethods}";

            code.code = defaultCode + code.code + DefaultCode.defaultClassEnd;

            // Add your code as a SyntaxTree
            //string code = "using System;\npublic class MyClass{\npublic void Execute() {\nConsole.Write(\"Hello, world!\");\n}\n }";
            var syntaxTree = CSharpSyntaxTree.ParseText(code.code);
            compilation = compilation.AddSyntaxTrees(syntaxTree);

            // Perform the compilation
            using var ms = new MemoryStream();
            EmitResult emitResult = compilation.Emit(ms);

            string? error = null;
            string? output = null;
            if (!emitResult.Success)
            {
                // Handle compilation errors
                foreach (var diagnostic in emitResult.Diagnostics)
                {
                    //Console.WriteLine(diagnostic);
                    error += diagnostic + "\n";
                }
            }
            else
            {
                // Load the compiled assembly from the MemoryStream
                ms.Seek(0, SeekOrigin.Begin);
                var assembly = Assembly.Load(ms.ToArray());

                // Use the dynamically compiled assembly
                Type myClassType = assembly.GetTypes().FirstOrDefault(type => type.Name == "Program");
                if (myClassType != null)
                {
                    MethodInfo method = myClassType.GetMethod("Main", BindingFlags.Public | BindingFlags.Static);
                    //dynamic myInstance = Activator.CreateInstance(myClassType);
                    //string message = myInstance.GetMessage();
                    //myInstance.Main(new string[0]); // Output: "Hello, world!"
                    string[] inputArgs = { "" };
                    if (code.input != "" && code.input != null)
                    {
                        string[] meow = code.input.Split(",");
                        Array.Resize(ref inputArgs, meow.Length);
                        inputArgs = meow;
                    }
                    method.Invoke(null, new object[] {inputArgs});
                    //output = "arroz";
                    
                    using(StreamReader sr = new StreamReader(DefaultCode.filePath))
                    {
                        output += sr.ReadToEnd();
                    }
                }

                
            }

            code.code = code.code.Replace(defaultCode, "");

            code.code = code.code.Remove(code.code.LastIndexOf("}"));

            var outputCode = new OutputCode()
            {

                code =  code.code,
                input = code.input,
                error = error,
                output = output

            };
            return new JsonResult(Ok(outputCode));
        }

    }
}
