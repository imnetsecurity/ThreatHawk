# verify_collector.ps1
# This script demonstrates a real-time subscription to the Sysmon event log,
# proving the collection logic of the Rust agent.

# 1. Define the query to get all events from the Sysmon operational log.
$query = @"
<QueryList>
  <Query Id="0" Path="Microsoft-Windows-Sysmon/Operational">
    <Select Path="Microsoft-Windows-Sysmon/Operational">*</Select>
  </Query>
</QueryList>
"@

Write-Host "Starting real-time Sysmon event listener..."
Write-Host "Press Ctrl+C to stop."
Write-Host "Any new Sysmon events (like starting a process) will appear below."

try {
    # 2. Create a new event log watcher that subscribes to the log using our query.
    # The [System.Diagnostics.Eventing.Reader.EventLogWatcher] class is the .NET equivalent
    # of the Windows API our Rust collector uses.
    $watcher = New-Object System.Diagnostics.Eventing.Reader.EventLogWatcher(
        [System.Diagnostics.Eventing.Reader.EventLogQuery]::new("Microsoft-Windows-Sysmon/Operational", [System.Diagnostics.Eventing.Reader.PathType]::LogName, $query)
    )

    # 3. Register an action to take when an event is raised. This is the "callback" or "listener".
    # This is analogous to the `for event in subscription.events()` loop in the Rust code.
    Register-ObjectEvent -InputObject $watcher -EventName "EventRecordWritten" -Action {
        # The event object is stored in the $event automatic variable.
        $eventRecord = $event.SourceEventArgs.EventRecord
        
        # Convert the event to XML, just like our agent does.
        $eventXML = $eventRecord.ToXml()

        # Print a separator and the event XML to the console.
        Write-Host "----------------------------------"
        Write-Host "[+] New Sysmon Event Received:"
        Write-Host $eventXML
        Write-Host "----------------------------------"
    } | Out-Null

    # 4. Wait indefinitely for events to arrive.
    while ($true) {
        Wait-Event
    }
}
catch {
    Write-Error "An error occurred. Please ensure Sysmon is installed and you are running this script with Administrator privileges."
    Write-Error $_.Exception.Message
}
