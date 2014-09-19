<?php
/**
 * Post hook for Bitbucket
 */

$payload = validateAndGetPayload();

if ($payload && needPull($payload)) {
    $currentBranch = getCurrentBranch();
    $gitResult = shell_exec('/usr/bin/git pull origin '.escapeshellarg($currentBranch).' 2>&1');
    writeLog($gitResult);
} else {
    writeLog('Do not pull');
}

// TODO: Clear Magento cache

/**
 * Get and validate post hook payload
 *
 * @return bool|mixed return the payload object or false on invalid payload
 */
function validateAndGetPayload() {
    if (!isset($_POST['payload'])) {
        writeLog('Not POST Request.');
        return false;
    }

    $payload = json_decode($_POST['payload']);

    if ( !isset($payload->commits)
      || !is_array($payload->commits)
    ) {
        writeLog('No commits info.');
        return false;
    }

    return $payload;
}

/**
 * Check if need to update our repo
 *
 * @param $payload the payload object
 * @return bool
 */
function needPull($payload)
{
    $currentBranch = getCurrentBranch();

    foreach ($payload->commits as $commit) {
        if ($commit->branch === $currentBranch) {
            return true;
        }
    }

    writeLog("No new commit on current branch ($currentBranch)");
    return false;
}

/**
 * Write log to var/log/__FILE__.log
 *
 * @param $msg Log message
 */
function writeLog($msg) {
    $logFile = 'var/log/'.basename(__FILE__, '.php').'.log';
    file_put_contents(
        $logFile,
        sprintf("%s {\n%s\n}\n", date('c'), $msg),
        FILE_APPEND
    );
}

/**
 * Get the branch name we currently on
 *
 * @return string The current branch name
 */
function getCurrentBranch() {
    return trim(shell_exec('/usr/bin/git rev-parse --abbrev-ref HEAD'));
}

