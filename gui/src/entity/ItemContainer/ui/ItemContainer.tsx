import { Box, Paper } from "@mui/material";
import type { ReactNode } from "react";

interface ItemContainerProps {
    id: string;
    children: ReactNode;
    action?: ReactNode;
}

export function ItemContainer({ id, children, action }: ItemContainerProps) {
    return (
        <Paper
            id={id}
            elevation={0}
            className="
                w-full box-border
                bg-[#853C48]
                border border-white/5
                rounded-xl p-4
                text-gray-100
                transition-all duration-200
                hover:bg-[#3D4552]
                hover:border-purple-400/40
            "
        >
            <Box className="w-full flex items-center justify-between gap-3">
                <Box className="min-w-0 flex-1">{children}</Box>
                {action}
            </Box>
        </Paper>
    );
}

export default ItemContainer;
