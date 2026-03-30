//Middleware/ExceptionLoggingMiddleware.cs
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Context;
using ILogger = Serilog.ILogger;

namespace Rosea.Middleware;

public class ExceptionLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger _logger;
    private readonly IHostEnvironment _env;

    public ExceptionLoggingMiddleware(RequestDelegate next, IHostEnvironment env)
    {
        _next = next;
        _logger = Log.ForContext<ExceptionLoggingMiddleware>();
        _env = env;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            var correlationId = context.Request.Headers["X-Correlation-ID"].FirstOrDefault() ?? Guid.NewGuid().ToString();
            context.Response.Headers["X-Correlation-ID"] = correlationId;

            using (LogContext.PushProperty("correlationId", correlationId))
            using (LogContext.PushProperty("service", "Rosea"))
            using (LogContext.PushProperty("env", _env.EnvironmentName))
            {
                //_logger.Error(ex, "{@Log}", new
                //{
                //    timestamp = DateTime.UtcNow,
                //    level = "ERROR",
                //    service = "Rosea",
                //    env = _env.EnvironmentName,
                //    message = ex.Message,
                //    exception = ex.ToString(),
                //    correlationId
                //});
                _logger.Error(ex, "Unhandled exception occurred");
            }

            // rethrow to allow upstream handling (status pages, etc.)
            throw;
        }
    }
}