<?php

namespace App\Controller\BackupChunk;

use App\Controller\Backup\BackupController;
use App\Entity\Backup;
use App\Repository\BackupChunkRepository;
use App\Repository\BackupRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class GetChunkController extends BackupController
{
    public function __construct(
        BackupRepository $backupRepository,
        private BackupChunkRepository $backupChunkRepository
    ) {
        parent::__construct($backupRepository);
    }

    #[Route('/api/chunk', name: 'app_get_chunk', methods: ['GET'])]
    public function index(Request $request): Response
    {
        /** @var Backup $backup */
        $backup = $this->verify($request);
        if (is_array($backup)) {
            return $this->buildResponse($backup);
        }

        $chunk_number = $request->query->get('chunk_number');

        if ($chunk_number === null) {
            return new JsonResponse(['ok' => false, 'error' => 'missing_chunk_number'], 400);
        }

        $chunk = $this->backupChunkRepository->findOneBy([
            'backup' => $backup,
            'chunkNumber' => $chunk_number,
        ]);

        if (!$chunk) {
            return new JsonResponse(['ok' => false, 'error' => 'chunk_not_found'], 404);
        }

        return new Response($chunk->data());
    }
}
