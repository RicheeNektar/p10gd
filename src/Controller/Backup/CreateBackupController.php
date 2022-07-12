<?php

namespace App\Controller\Backup;

use App\Entity\Backup;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class CreateBackupController extends BackupController
{
    #[Route('/api/backup', name: 'app_prepare', methods: ['POST'])]
    public function index(): JsonResponse
    {
        $time = (new \DateTimeImmutable())->format('d-m-Y H:i:s');
        $server_key = $this->getParameter('app.server_key');
        $key = hash_hmac('sha256', "$time", $server_key);

        $backup = (new Backup())
            ->setKey($key);

        $this->backupRepository->add($backup, true);
        return $this->json(['id' => $backup->id(), 'key' => $key]);
    }
}
