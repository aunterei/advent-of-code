$executionFolder = Get-Location
$repo = (get-item $executionFolder ).FullName
$scripts = $repo+"\scripts"
powershell $scripts\fetch-data.ps1 $args[0] $args[1] 
powershell $scripts\new.ps1 $args[0] $args[1]

npm run watch --aocYear=$args[0] --aocDay=$args[1]