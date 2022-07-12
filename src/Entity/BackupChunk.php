<?php

namespace App\Entity;

use App\Repository\BackupChunkRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Console\Logger\ConsoleLogger;
use Symfony\Component\HttpKernel\Log\Logger;

#[ORM\Entity(repositoryClass: BackupChunkRepository::class)]
#[ORM\Table(name: 'backup_chunks')]
class BackupChunk
{
    private const CIPHER = 'aes-128-cbc';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\ManyToOne(targetEntity: Backup::class, inversedBy: 'backupChunks')]
    #[ORM\JoinColumn(name: 'backup_id', referencedColumnName: 'id')]
    private Backup $backup;

    #[ORM\Column(type: 'integer', name: 'chunk_number')]
    private $chunkNumber;

    #[ORM\Column(type: 'string', length: 4140)]
    private string $data;

    #[ORM\PrePersist]
    public function onPrePersist()
    {
        $ivlen = openssl_cipher_iv_length(self::CIPHER);
        $iv = openssl_random_pseudo_bytes($ivlen);
        $data = openssl_encrypt($this->data, self::CIPHER, $this->backup->key(), 0, $iv);

        $this->data = base64_encode($iv . $data);
    }

    #[ORM\PostLoad]
    public function onPostLoad()
    {
        $ivlen = openssl_cipher_iv_length(self::CIPHER);

        $mix = base64_decode($this->data);
        $iv = substr($mix,0, $ivlen);
        $data = substr($mix, $ivlen);

        $this->data = openssl_decrypt($data, self::CIPHER, $this->backup->key(), 0, $iv);
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getBackup(): ?Backup
    {
        return $this->backup;
    }

    public function setBackup(?Backup $backup): self
    {
        $this->backup = $backup;

        return $this;
    }

    public function data(): ?string
    {
        return $this->data;
    }

    public function setData(string $data): self
    {
        $this->data = $data;
        return $this;
    }

    public function chunkNumber()
    {
        return $this->chunkNumber;
    }

    public function setChunkNumber($chunkNumber): self
    {
        $this->chunkNumber = $chunkNumber;
        return $this;
    }
}
