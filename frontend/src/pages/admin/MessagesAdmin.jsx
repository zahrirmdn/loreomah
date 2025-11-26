import React, { useState, useEffect } from "react";
import { Mail, MailOpen, Trash2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { useToast } from "../../hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog";
import API from "../../api/api";

const MessagesAdmin = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await API.get("/api/messages/");
      setMessages(res.data.messages || []);
    } catch (error) {
      console.error("Gagal memuat pesan:", error);
      toast({ title: "Gagal memuat pesan", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (messageId) => {
    try {
      await API.patch(`/api/messages/${messageId}/read`);
      toast({ title: "Pesan ditandai sebagai dibaca" });
      fetchMessages();
      if (selectedMessage?.id === messageId) {
        setSelectedMessage({ ...selectedMessage, is_read: true });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Gagal mengupdate pesan", variant: "destructive" });
    }
  };

  const handleDelete = async (messageId) => {
    try {
      await API.delete(`/api/messages/${messageId}`);
      toast({ title: "Pesan dihapus" });
      fetchMessages();
      setDeleteTarget(null);
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Gagal menghapus pesan", variant: "destructive" });
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center text-base sm:text-lg">
              <Mail className="mr-2" size={20} />
              <span className="text-sm sm:text-base">Kelola Pesan</span>
            </div>
            <Badge variant={unreadCount > 0 ? "destructive" : "secondary"} className="text-[10px] sm:text-xs">
              {unreadCount} Belum Dibaca
            </Badge>
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">Lihat dan kelola pesan dari pelanggan.</CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          {loading ? (
            <p className="text-center text-gray-500 text-sm">Memuat pesan...</p>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <AlertCircle className="mx-auto mb-3 sm:mb-4 text-gray-400" size={40} />
              <p className="text-gray-500 text-sm">Belum ada pesan masuk</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-colors ${
                    msg.is_read ? "bg-gray-50" : "bg-blue-50 border-blue-200"
                  } hover:shadow-md`}
                  onClick={() => setSelectedMessage(msg)}
                >
                  <div className="flex justify-between items-start mb-1.5 sm:mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {msg.is_read ? (
                          <MailOpen size={14} className="text-gray-400 sm:w-4 sm:h-4 flex-shrink-0" />
                        ) : (
                          <Mail size={14} className="text-blue-600 sm:w-4 sm:h-4 flex-shrink-0" />
                        )}
                        <h4 className="font-semibold text-gray-800 text-xs sm:text-sm truncate">{msg.subject}</h4>
                      </div>
                      <p className="text-[10px] sm:text-sm text-gray-600 mt-1 truncate">
                        Dari: <span className="font-medium">{msg.name}</span> ({msg.email})
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1 sm:gap-2 ml-2 flex-shrink-0">
                      <span className="text-[9px] sm:text-xs text-gray-500">{formatDate(msg.created_at)}</span>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-6 w-6 sm:h-auto sm:w-auto p-1 sm:p-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(msg);
                        }}
                      >
                        <Trash2 size={12} className="sm:w-3.5 sm:h-3.5" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-[10px] sm:text-sm text-gray-700 line-clamp-2">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Message Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">{selectedMessage?.subject}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
              <div>
                <p className="text-gray-500">Dari:</p>
                <p className="font-medium">{selectedMessage?.name}</p>
              </div>
              <div>
                <p className="text-gray-500">Email:</p>
                <p className="font-medium truncate">{selectedMessage?.email}</p>
              </div>
              <div>
                <p className="text-gray-500">Waktu:</p>
                <p className="font-medium">{formatDate(selectedMessage?.created_at)}</p>
              </div>
              <div>
                <p className="text-gray-500">Status:</p>
                <Badge variant={selectedMessage?.is_read ? "secondary" : "default"} className="text-[10px] sm:text-xs">
                  {selectedMessage?.is_read ? "Sudah Dibaca" : "Belum Dibaca"}
                </Badge>
              </div>
            </div>
            <div className="border-t pt-3 sm:pt-4">
              <p className="text-gray-500 text-xs sm:text-sm mb-2">Pesan:</p>
              <p className="text-gray-800 whitespace-pre-wrap text-xs sm:text-sm">{selectedMessage?.message}</p>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            {selectedMessage && !selectedMessage.is_read && (
              <Button onClick={() => handleMarkAsRead(selectedMessage.id)} variant="outline" className="text-sm">
                <MailOpen className="mr-2" size={16} />
                <span className="hidden sm:inline">Tandai Dibaca</span>
                <span className="sm:hidden">Dibaca</span>
              </Button>
            )}
            <Button onClick={() => setSelectedMessage(null)} className="text-sm">Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pesan?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus pesan dari <strong>{deleteTarget?.name}</strong> secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(deleteTarget?.id)}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MessagesAdmin;
