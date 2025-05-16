import { ArchiveX, ArrowLeftRight, CheckCircle, Clock, MapPin, PackageX, RefreshCcw, RotateCcw, Send, Truck, Undo2, Watch, XCircle } from "lucide-react";
import { JSX } from "react";

const statusIcons: Record<string, JSX.Element> = {
    "En préparation": <Clock className="h-3.5 w-3.5" />,
    "Expédié": <Send className="h-3.5 w-3.5" />,
    "Centre": <MapPin className="h-3.5 w-3.5" />,
    "Sorti en livraison": <Truck className="h-3.5 w-3.5" />,
    "En attente du client": <Watch className="h-3.5 w-3.5" />,
    "Tentative échouée": <RefreshCcw className="h-3.5 w-3.5" />,
    "Livré": <CheckCircle className="h-3.5 w-3.5" />,
    "Échec livraison": <XCircle className="h-3.5 w-3.5" />,
    "Retourné vers vendeur": <Undo2 className="h-3.5 w-3.5" />,
    "Retour à retirer": <PackageX className="h-3.5 w-3.5" />,
    "Retourné au vendeur": <RotateCcw className="h-3.5 w-3.5" />,
    "Echange (pas encore ramassé)": <ArrowLeftRight className="h-3.5 w-3.5" />,
    "Echange (Ramassé)": <ArrowLeftRight className="h-3.5 w-3.5" />,
    "Disparu / Cassé": <ArchiveX className="h-3.5 w-3.5" />,
};


export { statusIcons } ;
