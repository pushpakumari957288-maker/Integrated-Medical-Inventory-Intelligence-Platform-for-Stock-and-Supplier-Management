@echo off
setlocal
chcp 65001 > nul 2>&1

rem Check JAVA_HOME or find java
if not "%JAVA_HOME%"=="" (
    if exist "%JAVA_HOME%\bin\java.exe" (
        set "JAVACMD=%JAVA_HOME%\bin\java.exe"
    )
)

if "%JAVACMD%"=="" (
    if exist "C:\Program Files\Java\jdk-21\bin\java.exe" (
        set "JAVACMD=C:\Program Files\Java\jdk-21\bin\java.exe"
    ) else (
        for %%X in (java.exe) do (set "JAVACMD=%%~$PATH:X")
    )
)

if "%JAVACMD%"=="" (
    echo Error: JAVA_HOME is not set and java.exe was not found in PATH.
    echo Please install JDK 21 or set JAVA_HOME.
    exit /b 1
)

set "SHORT_DIR=%~sdp0"
set "WRAPPER_JAR=%SHORT_DIR%.mvn\wrapper\maven-wrapper.jar"

if not exist "%WRAPPER_JAR%" (
    echo Error: Could not find maven-wrapper.jar at "%WRAPPER_JAR%"
    exit /b 1
)

"%JAVACMD%" -Dfile.encoding=UTF-8 -Dsun.jnu.encoding=UTF-8 -classpath "%WRAPPER_JAR%" "-Dmaven.multiModuleProjectDirectory=%SHORT_DIR%." org.apache.maven.wrapper.MavenWrapperMain %*
exit /b %ERRORLEVEL%
