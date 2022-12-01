$executionFolder = Get-Location
$repo = (get-item $executionFolder ).FullName
$address = "https://adventofcode.com/"+$args[0]+"/day/"+$args[1]+"/input"
$outputFolder = $repo+"\src\solutions\"+$args[0]+"\day-"+$args[1]

If(!(test-path -PathType container $outputFolder))
{
    New-Item -ItemType Directory -Path $outputFolder
}

$outputFile = $outputFolder+"\data.txt"
$cookie = "session="+$env:AOC_SESSION_ID

curl.exe -s --cookie $cookie $address --output $outputFile