#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int concat_files(char *path, char *buffer, int start);
void write_and_run_file(char *path, char *buffer);

int main()
{
    // Run the Python file "example.py"
    // system("python example.py");
    char buffer[1024];
    memset(buffer, '\0', sizeof(buffer));
    FILE *file = fopen("example.txt", "r");
    int end = 0;
    char *paths[] = {"example.txt", "example1.txt", "example2.txt"};
    int path_index = 0;
    while (path_index < 3)
    {
        end = concat_files(paths[path_index], buffer, end);
        path_index++;
    }
    write_and_run_file("expample.py", buffer);
    return 0;
}

int concat_files(char *path, char *buffer, int start)
{
    FILE *file = fopen(path, "r");
    if (file != NULL)
    {
        char temp[1024];
        while (fgets(temp, sizeof(temp), file) != NULL)
        {
            strcat(buffer, temp);
            memset(temp, 0, sizeof(temp));
        }
        printf("%s", buffer);
        fclose(file); // Close the file when done
    }
    return 0;
}

void write_and_run_file(char *path, char *buffer)
{
    FILE *file = fopen(path, "wb");
    fwrite(buffer, sizeof(char), strlen(buffer), file);
    char cmd[100] = "python ";
    strcat(cmd, path);
    fclose(file); // Close the file when done
    system(cmd);
}
