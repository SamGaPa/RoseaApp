
using Microsoft.AspNetCore.Mvc;
using Serilog;
using ILogger = Serilog.ILogger;

namespace RoseaAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientLogsController : ControllerBase
{
    private readonly ILogger _logger = Log.ForContext<ClientLogsController>();


    [HttpPost("logfrontend")]
    public IActionResult LogFrontend([FromBody] object data)
    {
        Log.Information("Frontend Event: {@Data}", data);
        return Ok();
    }


    [HttpPost]
    public IActionResult Post([FromBody] ClientLogDto dto)
    {
        if (dto == null || string.IsNullOrWhiteSpace(dto.Message))
            return BadRequest();

        // Basic sanitation: do not log obvious sensitive fields
        _logger.Information("{@Log}",
            new
            {
                timestamp = DateTime.UtcNow,
                level = string.IsNullOrWhiteSpace(dto.Level) ? "INFO" : dto.Level.ToUpperInvariant(),
                service = "RoseaAPI",
                env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"),
                message = dto.Message,
                correlationId = dto.CorrelationId,
                userId = dto.UserId,
                method = dto.Method,
                path = dto.Path,
                status = dto.Status,
                responseTimeMs = dto.ResponseTimeMs,
                context = dto.Context
            });

        return Ok();
    }
}

public class ClientLogDto
{
    public string? Timestamp { get; set; }
    public string? Level { get; set; }
    public string? Service { get; set; }
    public string? Env { get; set; }
    public string Message { get; set; } = "";
    public string? CorrelationId { get; set; }
    public string? UserId { get; set; }
    public string? Method { get; set; }
    public string? Path { get; set; }
    public int? Status { get; set; }
    public long? ResponseTimeMs { get; set; }
    public object? Context { get; set; }
}