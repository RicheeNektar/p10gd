<?php

namespace App\Controller\Backup;

use App\Repository\BackupRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class BackupController extends AbstractController
{
    public function __construct(
        protected BackupRepository $backupRepository
    ) {}

    protected function getBackup(Request $request): mixed
    {
        $id = $request->request->get('id') ?? $request->query->get('id');

        if ($id === null) {
            return ['http' => 400, 'ok' => false, 'error' => 'missing_backup_id'];
        }

        $backup = $this->backupRepository->find($id);

        if ($backup === null) {
            return ['http' => 404, 'ok' => false, 'error' => 'backup_not_found'];
        }

        return $backup;
    }

    protected function verify(Request $request): mixed
    {
        $backup = $this->getBackup($request);
        if (is_array($backup)) {
            return $backup;
        }

        $key = $request->request->get('key') ?? $request->query->get('key');

        if ($key === null) {
            return ['http' => 400, 'ok' => false, 'error' => 'missing_key'];
        }

        if ($backup->key() !== $key) {
            return ['http' => 401, 'ok' => false, 'error' => 'backup_key_invalid'];
        }

        return $backup;
    }

    protected function buildResponse(array $input): JsonResponse
    {
        $http = $input['http'];
        return new JsonResponse(array_diff($input, ['http']), $http);
    }
}