//Middleware/RequestLoggingMiddleware.cs
using System.Diagnostics;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Context;
using ILogger = Serilog.ILogger;

namespace Rosea.Middleware;

public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger _logger;
    private readonly IHostEnvironment _env;

    public RequestLoggingMiddleware(RequestDelegate next, IHostEnvironment env)
    {
        _next = next;
        _logger = Log.ForContext<RequestLoggingMiddleware>();
        _env = env;
    }

    public async Task Invoke(HttpContext context)
    {
        var sw = Stopwatch.StartNew();
        var request = context.Request;
        var correlationId = request.Headers["X-Correlation-ID"].FirstOrDefault() ?? Guid.NewGuid().ToString();
        context.Response.Headers["X-Correlation-ID"] = correlationId;

        var method = request.Method;
        var path = request.Path + request.QueryString;
        var userId = context.User?.Identity?.IsAuthenticated == true ? context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value : null;

        using (LogContext.PushProperty("correlationId", correlationId))
        using (LogContext.PushProperty("userId", userId))
        using (LogContext.PushProperty("method", method))
        using (LogContext.PushProperty("path", path))
        using (LogContext.PushProperty("service", "Rosea"))
        using (LogContext.PushProperty("env", _env.EnvironmentName))
        {
            try
            {
                await _next(context);
            }
            finally
            {
                sw.Stop();
                var status = context.Response?.StatusCode ?? 0;
                var responseTimeMs = sw.ElapsedMilliseconds;

                _logger.Information(
    "HTTP request completed {Method} {Path} {Status} in {ResponseTimeMs} ms",
    method,
    path,
    status,
    responseTimeMs
);

                //_logger.Information("{@Log}",
                //    new
                //    {
                //        timestamp = DateTime.UtcNow,
                //        level = "INFO",
                //        service = "Rosea",
                //        env = _env.EnvironmentName,
                //        message = "HTTP request completed",
                //        method,
                //        path,
                //        status,
                //        responseTimeMs,
                //        correlationId,
                //        userId,
                //        context = (object?)null
                //    });
            }
        }
    }
}