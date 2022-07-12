<?php

namespace App\Entity;

use App\Repository\BackupRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: BackupRepository::class)]
#[ORM\Table(name: 'backups')]
class Backup
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(name: '`key`', type: 'string', length: 256, unique: true)]
    private $key;

    #[ORM\OneToMany(mappedBy: 'backup', targetEntity: BackupChunk::class, cascade: ['ALL'])]
    private $backupChunks;

    public function __construct()
    {
        $this->backupChunks = new ArrayCollection();
    }

    public function id(): ?int
    {
        return $this->id;
    }

    public function key(): ?string
    {
        return $this->key;
    }

    public function setKey(string $key): self
    {
        $this->key = $key;
        return $this;
    }

    /**
     * @return Collection<int, BackupChunk>
     */
    public function getBackupChunks(): Collection
    {
        return $this->backupChunks;
    }

    public function addBackupChunk(BackupChunk $backupChunk): self
    {
        if (!$this->backupChunks->contains($backupChunk)) {
            $this->backupChunks[] = $backupChunk;
            $backupChunk->setBackup($this);
        }

        return $this;
    }

    public function removeBackupChunk(BackupChunk $backupChunk): self
    {
        if ($this->backupChunks->removeElement($backupChunk)) {
            // set the owning side to null (unless already changed)
            if ($backupChunk->getBackup() === $this) {
                $backupChunk->setBackup(null);
            }
        }

        return $this;
    }
}
