<?php

namespace App\Controller\BackupChunk;

use App\Controller\Backup\BackupController;
use App\Entity\BackupChunk;
use App\Repository\BackupChunkRepository;
use App\Repository\BackupRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class CreateChunkController extends BackupController
{
    public function __construct(
        protected BackupRepository $backupRepository,
        private BackupChunkRepository $chunkRepository
    ) {
        parent::__construct($this->backupRepository);
    }

    #[Route('/api/chunk', name: "app_store_chunk", methods: ['POST'])]
    public function index(Request $request): JsonResponse
    {
        $data = $request->request->get('data');
        $chunk = $request->request->get('chunk_number');

        if ($data === null || $chunk === null) {
            return new JsonResponse(['ok' => false, 'error' => 'missing_parameters'], 400);
        }

        $backup = $this->getBackup($request);
        if (is_array($backup)) {
            return $this->buildResponse($backup);
        }

        $chunk = (new BackupChunk())
            ->setBackup($backup)
            ->setChunkNumber($chunk)
            ->setData($data);

        $this->chunkRepository->add($chunk, true);
        return new JsonResponse(['ok' => true]);
    }
}