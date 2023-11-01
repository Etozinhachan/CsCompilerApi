# Csharp Compiler API

 ## How to use the API

#### you'll need to send a request to the API by sending a json with the header "Content-Type: application/json" and up to this point there is only 1 endpoint, it being a POST method.

The json needs 2 members, "code" and "input", here's an example:

(( you'll need Newtonsoft.Json package from NuGet to use this example code in .net 6.0 ))

```cs
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net;
using System.Text;


namespace Test
{
    public class Code
    {
        public string code { get; set; }
        public string input { get; set; }

        public Code(string code, string input)
        {
            this.code = code;
            this.input = input;
        }
    }

    public class WebRequestPostExample
    {
        public static void Main()
        {
            // here you insert the URL
            const string URL = "https://apitest320231101145700.azurewebsites.net/api/Test/CompileCode";
            WebRequest request = WebRequest.Create(URL);
            
            // here its the Http Method we'll use ( in this case, POST )
            request.Method = "POST";

            // here its the data we'll send with the POST Method to the API ( basicly, it converts the object to a JSON )
            string jsonMessage = JsonConvert.SerializeObject(new Code("public static void Main(string[] args){ Write(args[0]); }", "10"));
            byte[] byteArray = Encoding.UTF8.GetBytes(jsonMessage);

            // the header you'll be using
            request.ContentType = "application/json";

            request.ContentLength = byteArray.Length;
            Stream dataStream = request.GetRequestStream();
            dataStream.Write(byteArray, 0, byteArray.Length);
            dataStream.Close();
            WebResponse response = request.GetResponse();
            Console.WriteLine(((HttpWebResponse)response).StatusDescription);
            dataStream = response.GetResponseStream();
            StreamReader reader = new StreamReader(dataStream);

            // gets the JSON response sent back by the API
            JObject responseFromServer = (JObject) JsonConvert.DeserializeObject(reader.ReadToEnd());

            // Display the input, output and errors sent back by the API
            Console.WriteLine("Partial Response: \n\n");
            Console.WriteLine($"input: {responseFromServer.SelectToken("value.input")}\nerror: {responseFromServer.SelectToken("value.error")}\noutput: {responseFromServer.SelectToken("value.output")}");

            // Displays the entire response sent back by the API
            Console.WriteLine("\n\nComplete Response: \n\n");
            Console.WriteLine(responseFromServer);

            reader.Close();
            dataStream.Close();
            response.Close();
        }
    }
}
```
The partial response output:

![image](https://github.com/Etozinhachan/CsCompilerApi/assets/116160881/2eec9dc0-30e6-42d6-b561-67e7cd1022e8)

the complete response output:

![image](https://github.com/Etozinhachan/CsCompilerApi/assets/116160881/e587d324-4f33-4b8b-9478-d338726aeb74) 
