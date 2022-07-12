<?php

namespace App\Controller\Backup;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class DeleteBackupController extends BackupController
{
    #[Route('/api/backup', name: 'app_drop_backup', methods: ['DELETE'])]
    public function index(Request $request): JsonResponse
    {
        $backup = $this->verify($request);

        if (is_array($backup)) {
            return $this->buildResponse($backup);
        }

        $this->backupRepository->remove($backup, true);
        return $this->json(['ok' => true]);
    }
}
