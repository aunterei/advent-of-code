$executionFolder = Get-Location
$repo = (get-item $executionFolder ).FullName
$outputFolder = $repo+"\src\solutions\"+$args[0]+"\day-"+$args[1]
$template = $repo+"\src\templates\index.ts"

#Create solution folder if not exist
If(!(test-path -PathType container $outputFolder))
{
    New-Item -ItemType Directory -Path $outputFolder
}

#Create a test.txt file if not exist
If(!(test-path $outputFolder"\test.txt"))
{
    New-Item -Path $outputFolder -Name "test.txt" -ItemType "file"
}

#Saving the arguments to retrieve them in pipe
#Fetching template, replacing values with passed arguments and saving in solution folder
If(!(test-path $outputFolder"\index.ts"))
{
    $savedArgs=$args
    Get-Content $template | %{$_ -replace "{{year}}",$savedArgs[0]} | %{$_ -replace "{{day}}",$savedArgs[1]} | Set-Content $outputFolder"\index.ts"
}