export interface Mahasiswa {
    id: number;
    nim: string;
    nama: string;
    jurusan: string;
    jenis_kelamin: 'L' | 'P';
}
  
export interface MahasiswaDTO {
    nim: string;
    nama: string;
    jurusan: string;
    jenis_kelamin: 'L' | 'P';
}