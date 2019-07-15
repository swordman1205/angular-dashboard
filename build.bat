nvm use 10.14.2
waitfor SomethingThatIsNeverHappening /t 5 2>NUL
SET PATH=%PATH%;C:\Program Files\nodejs\;C:\Program Files (x86)\Git\cmd;C:\Users\ebernste\AppData\Roaming\npm
echo Project Directory = %1
echo Target Director = %2

cd %1

echo Start of build
call :startNPMInstall
echo End of build
goto:eof

:startNPMInstall
	echo Running yarn install...
	npm install && (
		echo npm install Completed Successfully!!!
		(call )
		call :startBuild
		goto:eof
	) || (
		echo npm install Completed Failed!!!
		goto:eof
	)
	goto:eof

:startBuild
	echo Running build...
	npm run ecsbuild && (
		echo build Completed Successfully!!!
		(call )
		goto:eof
	) || (
		echo build Completed Failed!!!
		goto:eof
	)
	goto:eof
