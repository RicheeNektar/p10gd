<?php

namespace App\Controller\Backup;

use App\Entity\Backup;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class GetBackupController extends BackupController
{
    #[Route('/api/backup', name: 'app_get_backup', methods: ['GET'])]
    public function index(Request $request): Response
    {
        /** @var Backup $backup */
        $backup = $this->verify($request);
        if (is_array($backup)) {
            return $this->buildResponse($backup);
        }

        return new JsonResponse(['ok' => true, 'chunks' => $backup->getBackupChunks()->count()]);
    }
}